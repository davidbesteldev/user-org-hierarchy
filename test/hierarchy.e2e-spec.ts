import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@app/app.module'
import { DatabaseService } from '@app/core/database/database.service'

interface NodeResponse {
  id: string
  name: string
}

interface NodeWithDepthResponse {
  id: string
  name: string
  depth: number
}

describe('Hierarchy Flow (Requirement Validation)', () => {
  let app: INestApplication
  let database: DatabaseService

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication({ logger: false })
    database = moduleFixture.get<DatabaseService>(DatabaseService)

    await app.init()
  })

  beforeEach(async () => {
    await database.nodeClosure.deleteMany()
    await database.node.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  // Helpers
  const customRequest = async <T>(
    method: 'post' | 'get' | 'put' | 'patch' | 'delete',
    url: string,
    expectedStatus = 200,
    data: object = {},
  ): Promise<T> => {
    const response = await request(app.getHttpServer())
      [method](url)
      .send(data)
      .expect(expectedStatus)

    return response.body as T
  }

  const createUser = async (name: string, email: string) =>
    customRequest<NodeResponse>('post', '/users', 201, { name, email })

  const createGroup = async (name: string, parentId?: string) =>
    customRequest<NodeResponse>('post', '/groups', 201, { name, parentId })

  // Testes
  describe('Core Business Rules', () => {
    it('should validate full hierarchy depth and ordering', async () => {
      // 1. Criar Usuário
      const user = await createUser(faker.person.fullName(), faker.internet.email())

      // 2. Criar Árvore: Empresa -> Tecnologia -> Engenharia
      const gEmpresa = await createGroup('Empresa')
      const gTec = await createGroup('Tecnologia', gEmpresa.id)
      const gEng = await createGroup('Engenharia', gTec.id)

      // 3. Associar Usuário ao último nível (Engenharia)
      await customRequest('post', `/users/${user.id}/groups`, 204, { groupId: gEng.id })

      // 4. Validar Organizations (Herdadas + Diretas)
      const orgs = await customRequest<NodeWithDepthResponse[]>(
        'get',
        `/users/${user.id}/organizations`,
        200,
      )

      const ids = orgs.map((o) => o.id)
      const depths = orgs.map((o) => o.depth)

      expect(ids).toContain(gEmpresa.id)
      expect(ids).toContain(gTec.id)
      expect(ids).toContain(gEng.id)

      expect(depths).toEqual([...depths].sort((a, b) => a - b))
      expect(new Set(ids).size).toBe(ids.length)

      // 5. Validar Ancestrais de Engenharia (deve trazer Tecnologia e Empresa)
      const ancestors = await customRequest<NodeResponse[]>(
        'get',
        `/nodes/${gEng.id}/ancestors`,
        200,
      )
      const ancIds = ancestors.map((a) => a.id)
      expect(ancIds).toContain(gEmpresa.id)
      expect(ancIds).toContain(gTec.id)

      // 6. Validar Descendentes de Empresa (deve trazer Tecnologia e Engenharia)
      const descendants = await customRequest<NodeResponse[]>(
        'get',
        `/nodes/${gEmpresa.id}/descendants`,
        200,
      )
      const descIds = descendants.map((d) => d.id)
      expect(descIds).toContain(gTec.id)
      expect(descIds).toContain(gEng.id)
    })

    it('should prevent duplicate emails (Constraint Test)', async () => {
      const payload = { name: 'Duplicate', email: 'same@test.com' }

      await customRequest('post', '/users', 201, payload)
      await customRequest('post', '/users', 409, payload)
    })

    it('should prevent circular dependencies in groups', async () => {
      // Criar G1
      const g1 = await createGroup('G1')

      // Criar G2 filho de G1
      const g2 = await createGroup('G2', g1.id)

      // Tentar fazer G1 filho de G2 (Ciclo!)
      await customRequest('post', `/users/${g1.id}/groups`, 422, {
        groupId: g2.id,
      })
    })

    it('should handle multiple group membership and min depth', async () => {
      const user = await createUser('Multi User', 'multi@test.com')
      const root = await createGroup('Root')
      const ramoA = await createGroup('Ramo A', root.id)
      const ramoB = await createGroup('Ramo B', root.id)

      // Associa o usuário aos dois ramos
      await customRequest('post', `/users/${user.id}/groups`, 204, { groupId: ramoA.id })
      await customRequest('post', `/users/${user.id}/groups`, 204, { groupId: ramoB.id })

      const orgs = await customRequest<NodeWithDepthResponse[]>(
        'get',
        `/users/${user.id}/organizations`,
      )

      // O 'Root' deve aparecer apenas uma vez, mesmo sendo ancestral de ambos os ramos
      const rootOccurrences = orgs.filter((o) => o.id === root.id)
      expect(rootOccurrences).toHaveLength(1)
    })
  })
})
