export enum HalFormsEntityName {
  LINK = 'link',
  EMBEDDED = 'embedded',
  TEMPLATE = 'template',
}

export enum ContentType {
  APPLICATION_JSON = 'application/json',
  APPLICATION_JSON_HAL = 'application/hal+json',
  APPLICATION_JSON_HAL_FORMS = 'application/prs.hal-forms+json',
  MULTIPART_FILE = 'multipart/form-data',
}

export enum HttpMethod {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  CONNECT = 'CONNECT',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
}
