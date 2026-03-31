/**
 * External References/Inspirations:
 * - https://github.com/pragmaticivan/nestjs-otel
 * - https://signoz.io/blog/opentelemetry-nestjs/
 */

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import {
  BatchSpanProcessor,
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} from '@opentelemetry/sdk-trace-base'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
  SemanticResourceAttributes,
} from '@opentelemetry/semantic-conventions'

import { isIgnoredPath } from '@app/shared/config/monitoring.config'

const isProduction = process.env.NODE_ENV === 'production'
const otlpHeaders = process.env.OTEL_EXPORTER_OTLP_HEADERS
  ? (JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS) as Record<string, string>)
  : {}

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  headers: otlpHeaders,
})

const otelSDK = new NodeSDK({
  metricReader: new PrometheusExporter({
    port: Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT),
  }),

  sampler: new ParentBasedSampler({
    root: new TraceIdRatioBasedSampler(isProduction ? 0.1 : 1.0),
  }),

  spanProcessor: new BatchSpanProcessor(traceExporter, {
    maxExportBatchSize: isProduction ? 200 : 50,
    exportTimeoutMillis: isProduction ? 5000 : 2000,
    scheduledDelayMillis: isProduction ? 2000 : 1000,
  }),

  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: process.env.APP_NAME,
    [ATTR_SERVICE_VERSION]: process.env.APP_VERSION,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),

  instrumentations: [
    new PinoInstrumentation({
      logKeys: { traceId: 'trace_id', spanId: 'span_id', traceFlags: 'trace_flags' },
    }),
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        ignoreIncomingRequestHook: (req) => isIgnoredPath(req.url),
      },
    }),
  ],
})

export default otelSDK

process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0))
})
