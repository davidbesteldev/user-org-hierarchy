export abstract class BaseRepository<Delegate> {
  constructor(private readonly _model: Delegate) {}

  get model() {
    return this._model
  }
}
