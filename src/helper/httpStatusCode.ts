export enum Status {
  // eslint-disable-next-line no-unused-vars
  SUCCESS = 'success',
  // eslint-disable-next-line no-unused-vars
  FAIL = 'fail',
  // eslint-disable-next-line no-unused-vars
  ERROR = 'error',
}

export default class HttpStatusCode {
  public readonly code: number;

  public readonly name: string;

  public readonly description: string;

  private constructor(code: number, name: string, description: string) {
    this.code = code;
    this.name = name;
    this.description = description;
  }

  public isSuccess(): boolean {
    return HttpStatusCode.isSuccess(this);
  }

  public static isSuccess(httpStatusCode: HttpStatusCode): boolean {
    return httpStatusCode.code >= 200 && httpStatusCode.code <= 299;
  }

  public status(): Status {
    return HttpStatusCode.status(this);
  }

  public static status(httpStatusCode: HttpStatusCode): Status {
    let status = Status.ERROR;

    if (HttpStatusCode.SUCCESSFUL_RESPONSES.has(httpStatusCode)) {
      status = Status.SUCCESS;
    } else if (HttpStatusCode.CLIENT_ERROR_RESPONSES.has(httpStatusCode)) {
      status = Status.FAIL;
    }

    return status;
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  // HTTP Status Codes
  public static readonly CONTINUE = new HttpStatusCode(
    100,
    'Continue',
    'This interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished'
  );

  public static readonly SWITCHING_PROTOCOL = new HttpStatusCode(
    101,
    'Switching Protocol',
    'This code is sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too'
  );

  public static readonly PROCESSING = new HttpStatusCode(
    102,
    'Processing',
    'This code indicates that the server has received and is processing the request, but no response is available yet'
  );

  public static readonly EARLY_HINTS = new HttpStatusCode(
    103,
    'Early Hints',
    'This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response'
  );

  public static readonly OK = new HttpStatusCode(200, 'Ok', 'The request has succeeded');

  public static readonly CREATED = new HttpStatusCode(
    201,
    'Created',
    'The request has succeeded and a new resource has been created as a result of it'
  );

  public static readonly ACCEPTED = new HttpStatusCode(
    202,
    'Accepted',
    'The request has been received but not yet acted upon'
  );

  public static readonly NON_AUTHORITATIVE_INFORMATION = new HttpStatusCode(
    203,
    'Non-Authoritative Information',
    'This response code means returned meta-information set is not exact set as available from the origin server, but collected from a local or a third party copy'
  );

  public static readonly NO_CONTENT = new HttpStatusCode(
    204,
    'No Content',
    'There is no content to send for this request, but the headers may be useful'
  );

  public static readonly RESET_CONTENT = new HttpStatusCode(
    205,
    'Reset Content',
    'This response code is sent after accomplishing request to tell user agent reset document view which sent this request'
  );

  public static readonly PARTIAL_CONTENT = new HttpStatusCode(
    206,
    'Partial Content',
    'This response code is used because of range header sent by the client to separate download into multiple streams'
  );

  public static readonly MULTI_STATUS = new HttpStatusCode(
    207,
    'Multi-Status',
    'Conveys information about multiple resources, for situations where multiple status codes might be appropriate'
  );

  public static readonly ALREADY_REPORTED = new HttpStatusCode(
    208,
    'Already Reported',
    'Used inside a <dav:propstat> response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection'
  );

  public static readonly IM_USED = new HttpStatusCode(
    226,
    'IM Used',
    'The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance'
  );

  public static readonly MULTIPLE_CHOICE = new HttpStatusCode(
    300,
    'Multiple Choice',
    'The request has more than one possible responses'
  );

  public static readonly MOVED_PERMANENTLY = new HttpStatusCode(
    301,
    'Moved Permanently',
    'This response code means that URI of requested resource has been changed'
  );

  public static readonly FOUND = new HttpStatusCode(
    302,
    'Found',
    'This response code means that URI of requested resource has been changed temporarily'
  );

  public static readonly SEE_OTHER = new HttpStatusCode(
    303,
    'See Other',
    'Server sent this response to directing client to get requested resource to another URI with an GET request'
  );

  public static readonly NOT_MODIFIED = new HttpStatusCode(
    304,
    'Multiple Choice',
    'Used for caching purposes, it is telling to client that response has not been modified'
  );

  public static readonly TEMPORARY_REDIRECT = new HttpStatusCode(
    307,
    'Temporary Redirect',
    'Server sent this response to directing client to get requested resource to another URI with same method that used prior request'
  );

  public static readonly PERMANENT_REDIRECT = new HttpStatusCode(
    308,
    'Permanent Redirect',
    'This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header'
  );

  public static readonly BAD_REQUEST = new HttpStatusCode(
    400,
    'Bad Request',
    'This response means that server could not understand the request due to invalid syntax'
  );

  public static readonly UNAUTHORIZED = new HttpStatusCode(
    401,
    'Unauthorized',
    'Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated"'
  );

  public static readonly PAYMENT_REQUIRED = new HttpStatusCode(
    402,
    'Payment Required',
    'This response code is reserved for future use'
  );

  public static readonly FORBIDDEN = new HttpStatusCode(
    403,
    'Forbidden',
    'The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response'
  );

  public static readonly NOT_FOUND = new HttpStatusCode(
    404,
    'Not Found',
    'The server can not find requested resource'
  );

  public static readonly METHOD_NOT_ALLOWED = new HttpStatusCode(
    405,
    'Method Not Allowed',
    'The request method is known by the server but has been disabled and cannot be used'
  );

  public static readonly NOT_ACCEPTABLE = new HttpStatusCode(
    406,
    'Not Acceptable',
    "This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent"
  );

  public static readonly PROXY_AUTHENTICATION_REQUIRED = new HttpStatusCode(
    407,
    'Proxy Authentication Required',
    'This is similar to 401 but authentication is needed to be done by a proxy'
  );

  public static readonly REQUEST_TIMEOUT = new HttpStatusCode(
    408,
    'Request Timeout',
    'This response is sent on an idle connection by some servers, even without any previous request by the client'
  );

  public static readonly CONFLICT = new HttpStatusCode(
    409,
    'Conflict',
    'This response is sent when a request conflicts with the current state of the server'
  );

  public static readonly GONE = new HttpStatusCode(
    410,
    'Gone',
    'This response would be sent when the requested content has been permenantly deleted from server, with no forwarding address'
  );

  public static readonly LENGTH_REQUIRED = new HttpStatusCode(
    411,
    'Length Required',
    'Server rejected the request because the Content-Length header field is not defined and the server requires it'
  );

  public static readonly PRECONDITION_FAILED = new HttpStatusCode(
    412,
    'Precondition Failed',
    'The client has indicated preconditions in its headers which the server does not meet'
  );

  public static readonly PAYLOAD_TOO_LARGE = new HttpStatusCode(
    413,
    'Payload Too Large',
    'Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field'
  );

  public static readonly URI_TOO_LONG = new HttpStatusCode(
    414,
    'URI Too Long',
    'The URI requested by the client is longer than the server is willing to interpret'
  );

  public static readonly UNSUPPORTED_MEDIA_TYPE = new HttpStatusCode(
    415,
    'Unsupported Media Type',
    'The media format of the requested data is not supported by the server, so the server is rejecting the request'
  );

  public static readonly RANGE_NOT_SATISFIABLE = new HttpStatusCode(
    416,
    'Range Not Satisfiable',
    "The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data"
  );

  public static readonly EXPECTATION_FAILED = new HttpStatusCode(
    417,
    'Expectation Failed',
    "This response code means the expectation indicated by the Expect request header field can't be met by the server"
  );

  public static readonly I_AM_A_TEAPOT = new HttpStatusCode(
    418,
    'Expectation Failed',
    'The server refuses the attempt to brew coffee with a teapot'
  );

  public static readonly MISDIRECTED_REQUEST = new HttpStatusCode(
    421,
    'Misdirected Request',
    'The request was directed at a server that is not able to produce a response'
  );

  public static readonly UNPROCESSABLE_ENTITY = new HttpStatusCode(
    422,
    'Unprocessable Entity',
    'The request was well-formed but was unable to be followed due to semantic errors'
  );

  public static readonly LOCKED = new HttpStatusCode(
    423,
    'Locked',
    'The resource that is being accessed is locked'
  );

  public static readonly FAILED_DEPENDENCY = new HttpStatusCode(
    424,
    'Failed Dependency',
    'The request failed due to failure of a previous request'
  );

  public static readonly TOO_EARLY = new HttpStatusCode(
    425,
    'Too Early',
    'Indicates that the server is unwilling to risk processing a request that might be replayed'
  );

  public static readonly UPGRADE_REQUIRED = new HttpStatusCode(
    426,
    'Upgrade Required',
    'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol'
  );

  public static readonly PRECONDITION_REQUIRED = new HttpStatusCode(
    428,
    'Precondition Required',
    'The origin server requires the request to be conditional'
  );

  public static readonly TOO_MANY_REQUESTS = new HttpStatusCode(
    429,
    'Too Many Requests',
    'The user has sent too many requests in a given amount of time ("rate limiting")'
  );

  public static readonly REQUEST_HEADER_FIELDS_TOO_LARGE = new HttpStatusCode(
    431,
    'Request Header Fields Too Large',
    'The server is unwilling to process the request because its header fields are too large'
  );

  public static readonly UNAVAILABLE_FOR_LEGAL_REASONS = new HttpStatusCode(
    451,
    'Unavailable For Legal Reasons',
    'The user requests an illegal resource, such as a web page censored by a government'
  );

  public static readonly INTERNAL_SERVER_ERROR = new HttpStatusCode(
    500,
    'Internal Server Error',
    "The server has encountered a situation it doesn't know how to handle"
  );

  public static readonly NOT_IMPLEMENTED = new HttpStatusCode(
    501,
    'Not Implemented',
    'The request method is not supported by the server and cannot be handled'
  );

  public static readonly BAD_GATEWAY = new HttpStatusCode(
    502,
    'Bad Gateway',
    'This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response'
  );

  public static readonly SERVICE_UNAVAILABLE = new HttpStatusCode(
    503,
    'Service Unavailable',
    'The server is not ready to handle the request'
  );

  public static readonly GATEWAY_TIMEOUT = new HttpStatusCode(
    504,
    'Gateway Timeout',
    'This error response is given when the server is acting as a gateway and cannot get a response in time'
  );

  public static readonly HTTP_VERSION_NOT_SUPPORTED = new HttpStatusCode(
    505,
    'HTTP Version Not Supported',
    'The HTTP version used in the request is not supported by the server'
  );

  public static readonly VARIANT_ALSO_NEGOTIATES = new HttpStatusCode(
    506,
    'Variant Also Negotiates',
    'The server has an internal configuration error: transparent content negotiation for the request results in a circular reference'
  );

  public static readonly INSUFFICIENT_STORAGE = new HttpStatusCode(
    507,
    'Insufficient Storage',
    'The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process'
  );

  public static readonly LOOP_DETECTED = new HttpStatusCode(
    508,
    'Loop Detected',
    'The server detected an infinite loop while processing the request'
  );

  public static readonly NOT_EXTENDED = new HttpStatusCode(
    510,
    'Not Extended',
    'Further extensions to the request are required for the server to fulfill it'
  );

  public static readonly NETWORK_AUTHENTICATION_REQUIRED = new HttpStatusCode(
    511,
    'Network Authentication Required',
    'The 511 status code indicates that the client needs to authenticate to gain network access'
  );
  // END HTTP Status Codes

  // Informational Responses
  public static readonly INFORMATIONAL_RESPONSES: Set<HttpStatusCode> = new Set([
    HttpStatusCode.CONTINUE,
    HttpStatusCode.SWITCHING_PROTOCOL,
    HttpStatusCode.PROCESSING,
    HttpStatusCode.EARLY_HINTS,
  ]);
  // END Informational Responses

  // Successful Responses
  public static readonly SUCCESSFUL_RESPONSES: Set<HttpStatusCode> = new Set([
    HttpStatusCode.OK,
    HttpStatusCode.CREATED,
    HttpStatusCode.ACCEPTED,
    HttpStatusCode.NON_AUTHORITATIVE_INFORMATION,
    HttpStatusCode.NO_CONTENT,
    HttpStatusCode.RESET_CONTENT,
    HttpStatusCode.PARTIAL_CONTENT,
    HttpStatusCode.MULTI_STATUS,
    HttpStatusCode.ALREADY_REPORTED,
    HttpStatusCode.IM_USED,
  ]);
  // END Successful Responses

  // Redirection Messages
  public static readonly REDIRECTION_MESSAGES: Set<HttpStatusCode> = new Set([
    HttpStatusCode.MULTIPLE_CHOICE,
    HttpStatusCode.MOVED_PERMANENTLY,
    HttpStatusCode.FOUND,
    HttpStatusCode.SEE_OTHER,
    HttpStatusCode.NOT_MODIFIED,
    HttpStatusCode.TEMPORARY_REDIRECT,
    HttpStatusCode.PERMANENT_REDIRECT,
  ]);
  // END Redirection messages

  // Client Error Responses
  public static readonly CLIENT_ERROR_RESPONSES: Set<HttpStatusCode> = new Set([
    HttpStatusCode.BAD_REQUEST,
    HttpStatusCode.UNAUTHORIZED,
    HttpStatusCode.PAYMENT_REQUIRED,
    HttpStatusCode.FORBIDDEN,
    HttpStatusCode.NOT_FOUND,
    HttpStatusCode.METHOD_NOT_ALLOWED,
    HttpStatusCode.NOT_ACCEPTABLE,
    HttpStatusCode.PROXY_AUTHENTICATION_REQUIRED,
    HttpStatusCode.REQUEST_TIMEOUT,
    HttpStatusCode.CONFLICT,
    HttpStatusCode.GONE,
    HttpStatusCode.LENGTH_REQUIRED,
    HttpStatusCode.PRECONDITION_FAILED,
    HttpStatusCode.PAYLOAD_TOO_LARGE,
    HttpStatusCode.URI_TOO_LONG,
    HttpStatusCode.UNSUPPORTED_MEDIA_TYPE,
    HttpStatusCode.RANGE_NOT_SATISFIABLE,
    HttpStatusCode.EXPECTATION_FAILED,
    HttpStatusCode.I_AM_A_TEAPOT,
    HttpStatusCode.MISDIRECTED_REQUEST,
    HttpStatusCode.UNPROCESSABLE_ENTITY,
    HttpStatusCode.LOCKED,
    HttpStatusCode.FAILED_DEPENDENCY,
    HttpStatusCode.TOO_EARLY,
    HttpStatusCode.UPGRADE_REQUIRED,
    HttpStatusCode.PRECONDITION_REQUIRED,
    HttpStatusCode.TOO_MANY_REQUESTS,
    HttpStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE,
    HttpStatusCode.UNAVAILABLE_FOR_LEGAL_REASONS,
  ]);
  // END Client Error Responses

  // Server error responses
  public static readonly SERVER_ERROR_RESPONSES: Set<HttpStatusCode> = new Set([
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    HttpStatusCode.NOT_IMPLEMENTED,
    HttpStatusCode.BAD_GATEWAY,
    HttpStatusCode.SERVICE_UNAVAILABLE,
    HttpStatusCode.GATEWAY_TIMEOUT,
    HttpStatusCode.HTTP_VERSION_NOT_SUPPORTED,
    HttpStatusCode.VARIANT_ALSO_NEGOTIATES,
    HttpStatusCode.INSUFFICIENT_STORAGE,
    HttpStatusCode.LOOP_DETECTED,
    HttpStatusCode.NOT_EXTENDED,
    HttpStatusCode.NETWORK_AUTHENTICATION_REQUIRED,
  ]);
  // END Server error responses

  // HTTP Status Codes list
  public static readonly HTTP_STATUS_CODES: Set<HttpStatusCode> = new Set([
    ...HttpStatusCode.INFORMATIONAL_RESPONSES,
    ...HttpStatusCode.SUCCESSFUL_RESPONSES,
    ...HttpStatusCode.REDIRECTION_MESSAGES,
    ...HttpStatusCode.CLIENT_ERROR_RESPONSES,
    ...HttpStatusCode.SERVER_ERROR_RESPONSES,
  ]);
  // END HTPP Status Codes list
}
