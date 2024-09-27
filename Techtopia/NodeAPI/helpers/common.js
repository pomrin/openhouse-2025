require('dotenv').config();

// 200 OK
// The request succeeded. The result meaning of "success" depends on the HTTP method:

// GET: The resource has been fetched and transmitted in the message body.
// HEAD: The representation headers are included in the response without any message body.
// PUT or POST: The resource describing the result of the action is transmitted in the message body.
// TRACE: The message body contains the request message as received by the server.


// 201 Created
// The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.


// 202 Accepted
// The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.


// 203 Non-Authoritative Information
// This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.


// 204 No Content
// There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones.


// 400 Bad Request
// The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).


// 401 Unauthorized
// Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.


// 402 Payment Required Experimental
// This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.


// 403 Forbidden
// The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.


// 404 Not Found
// The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.


// 405 Method Not Allowed
// The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling DELETE to remove a resource.


// 406 Not Acceptable
// This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.


// 407 Proxy Authentication Required
// This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.


// 408 Request Timeout
// This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.


// 409 Conflict
// This response is sent when a request conflicts with the current state of the server.

// 412 Precondition Failed
// The client has indicated preconditions in its headers which the server does not meet.

// 422 Unprocessable Entity (WebDAV)
// The request was well-formed but was unable to be followed due to semantic errors.

// 500 Internal Server Error
// The server has encountered a situation it does not know how to handle.


// 501 Not Implemented
// The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.


// 502 Bad Gateway
// This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.


// 503 Service Unavailable
// The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.


// 504 Gateway Timeout
// This error response is given when the server is acting as a gateway and cannot get a response in time.


// 505 HTTP Version Not Supported
// The HTTP version used in the request is not supported by the server.


// 506 Variant Also Negotiates
// The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.


// 507 Insufficient Storage (WebDAV)
// The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.


// 508 Loop Detected (WebDAV)
// The server detected an infinite loop while processing the request.


// 510 Not Extended
// Further extensions to the request are required for the server to fulfill it.


// 511 Network Authentication Required
// Indicates that the client needs to authenticate to gain network access.


module.exports.createLambdaResponse = async (event, responseCode, body) => {
    const corsWhitelist = process.env.APPLICATION_URL.split(",").map(item => item.trim());
    const requestOrigin = event?.headers?.origin ? event?.headers?.origin : event?.headers?.Origin;
    // console.log(`event?.headers - ${JSON.stringify(event?.headers)}`);

    if (corsWhitelist.includes(requestOrigin)
        || requestOrigin === undefined) {
        var response = {
            statusCode: responseCode,
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': requestOrigin, // Required for CORS support to work
            },
            body: JSON.stringify({
                data: body,
            }),
        };
    } else {
        console.log(`Invalid Application attempted to access API - ${requestOrigin}`);
        response = {
            statusCode: responseCode,
            headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': process.env.APPLICATION_URL, // Required for CORS support to work
            },
            body: JSON.stringify({
                data: body,
            }),
        };
    }
    return response;
};

