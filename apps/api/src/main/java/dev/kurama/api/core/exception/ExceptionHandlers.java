package dev.kurama.api.core.exception;

import static java.lang.String.format;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import com.auth0.jwt.exceptions.TokenExpiredException;
import dev.kurama.api.core.domain.DomainResponse;
import dev.kurama.api.core.exception.domain.ForbiddenException;
import dev.kurama.api.core.exception.domain.ImmutableRoleException;
import dev.kurama.api.core.exception.domain.RoleCanNotLoginException;
import dev.kurama.api.core.exception.domain.SignupClosedException;
import dev.kurama.api.core.exception.domain.exists.EntityExistsException;
import dev.kurama.api.core.exception.domain.not.found.EntityNotFoundException;
import jakarta.persistence.NoResultException;
import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.Objects;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class ExceptionHandlers {

  private static final String AN_ERROR_HAS_OCCURRED = "An error has occurred";

  private static final String ACCOUNT_IS_LOCKED = "User account is locked";
  private static final String ROLE_IS_LOCKED = "%s is locked";
  private static final String TOKEN_EXPIRED = "This token is expired. Log in again to get a valid one.";
  private static final String METHOD_IS_NOT_ALLOWED = "This request method is not allowed on this endpoint. Please "
    + "send a '%s' request";
  private static final String INCORRECT_CREDENTIALS = "Username / password incorrect. Please try again";
  private static final String ACCOUNT_DISABLED = "Your account has been disabled. If this is an error, please contact"
    + " administration";
  private static final String ERROR_PROCESSING_FILE = "Error occurred while processing file";
  private static final String ENTITY_NOT_FOUND_MESSAGE = "%s with id: %s not found";
  private static final String NOT_FOUND_MESSAGE = "Id %s not found";
  private static final String ENTITY_EXISTS_MESSAGE = "%s with unique id: %s already exists";
  private static final String EXISTS_MESSAGE = "Id %s already exists";
  private static final String IMMUTABLE_ROLE = "Role %s is immutable";
  private static final String SIGN_UP_CLOSED = "Sign Up is closed, try again later.";
  private static final String FORBIDDEN_REQUEST = "Sorry, you do not have permission to access this resource.";
  private static final String NO_MAPPING_ERROR = "There is no mapping for this URL";

  @ResponseStatus(code = BAD_REQUEST)
  @ExceptionHandler({NullPointerException.class, IllegalArgumentException.class, ConversionFailedException.class,
    MissingServletRequestParameterException.class, UnsupportedOperationException.class,
    HttpMessageNotReadableException.class})
  public ResponseEntity<DomainResponse> badRequest(Exception exception) {
    return createDomainResponse(BAD_REQUEST, AN_ERROR_HAS_OCCURRED, exception.getMessage());
  }

  @ResponseStatus(code = BAD_REQUEST)
  @ExceptionHandler(DisabledException.class)
  public ResponseEntity<DomainResponse> accountDisabledException(DisabledException exception) {
    return createDomainResponse(BAD_REQUEST, ACCOUNT_DISABLED, exception.getMessage());
  }

  @ResponseStatus(code = BAD_REQUEST)
  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<DomainResponse> badCredentialsException(BadCredentialsException exception) {
    return createDomainResponse(BAD_REQUEST, INCORRECT_CREDENTIALS, exception.getMessage());
  }

  @ResponseStatus(code = UNAUTHORIZED)
  @ExceptionHandler(LockedException.class)
  public ResponseEntity<DomainResponse> lockedException(LockedException exception) {
    return createDomainResponse(UNAUTHORIZED, ACCOUNT_IS_LOCKED, exception.getMessage());
  }

  @ResponseStatus(code = UNAUTHORIZED)
  @ExceptionHandler(RoleCanNotLoginException.class)
  public ResponseEntity<DomainResponse> roleCanNotLoginException(RoleCanNotLoginException exception) {
    return createDomainResponse(UNAUTHORIZED, format(ROLE_IS_LOCKED, exception.getMessage()), exception.getMessage());
  }

  @ResponseStatus(code = UNAUTHORIZED)
  @ExceptionHandler(TokenExpiredException.class)
  public ResponseEntity<DomainResponse> tokenExpiredException(TokenExpiredException exception) {
    return createDomainResponse(UNAUTHORIZED, TOKEN_EXPIRED, exception.getMessage());
  }

  @ResponseStatus(code = FORBIDDEN)
  @ExceptionHandler(ImmutableRoleException.class)
  public ResponseEntity<DomainResponse> immutableRoleException(ImmutableRoleException exception) {
    return createDomainResponse(FORBIDDEN, format(IMMUTABLE_ROLE, exception.getMessage()), exception.getMessage());
  }

  @ResponseStatus(code = FORBIDDEN)
  @ExceptionHandler(SignupClosedException.class)
  public ResponseEntity<DomainResponse> signupClosedException(SignupClosedException exception) {
    return createDomainResponse(FORBIDDEN, SIGN_UP_CLOSED, exception.getMessage());
  }

  @ResponseStatus(code = FORBIDDEN)
  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<DomainResponse> forbiddenException(ForbiddenException exception) {
    return createDomainResponse(FORBIDDEN, FORBIDDEN_REQUEST, exception.getMessage());
  }

  @ResponseStatus(code = CONFLICT)
  @ExceptionHandler(EntityExistsException.class)
  public ResponseEntity<DomainResponse> entityExistsException(EntityExistsException exception) {
    return createDomainResponse(CONFLICT,
      exception.getEntityClass() != null ? format(ENTITY_EXISTS_MESSAGE, exception.getEntityClass().getSimpleName(),
        exception.getMessage()) : format(EXISTS_MESSAGE, exception.getMessage()), "");
  }

  @ResponseStatus(code = NOT_FOUND)
  @ExceptionHandler({EntityNotFoundException.class})
  public ResponseEntity<DomainResponse> entityNotFoundException(EntityNotFoundException exception) {
    return createDomainResponse(NOT_FOUND, exception.getEntityClass() != null ? String.format(ENTITY_NOT_FOUND_MESSAGE,
      exception.getEntityClass().getSimpleName(), exception.getMessage())
      : String.format(NOT_FOUND_MESSAGE, exception.getMessage()), exception.getMessage());
  }

  @ResponseStatus(code = NOT_FOUND)
  @ExceptionHandler({NoSuchElementException.class, NoResultException.class,})
  public ResponseEntity<DomainResponse> notFoundException(Exception exception) {
    return createDomainResponse(NOT_FOUND, String.format(NOT_FOUND_MESSAGE, exception.getMessage()),
      exception.getMessage());
  }

  @ResponseStatus(code = METHOD_NOT_ALLOWED)
  @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
  public ResponseEntity<DomainResponse> methodNotSupportedException(HttpRequestMethodNotSupportedException exception) {
    HttpMethod supportedMethod = Objects.requireNonNull(exception.getSupportedHttpMethods()).iterator().next();
    return createDomainResponse(METHOD_NOT_ALLOWED, String.format(METHOD_IS_NOT_ALLOWED, supportedMethod),
      exception.getMessage());
  }

  @ResponseStatus(code = INTERNAL_SERVER_ERROR)
  @ExceptionHandler(IOException.class)
  public ResponseEntity<DomainResponse> iOException(IOException exception) {
    return createDomainResponse(INTERNAL_SERVER_ERROR, ERROR_PROCESSING_FILE, exception.getMessage());
  }

  @ResponseStatus(code = BAD_REQUEST)
  @ExceptionHandler(NoHandlerFoundException.class)
  public ResponseEntity<DomainResponse> noHandlerFoundException(NoHandlerFoundException exception) {
    return createDomainResponse(BAD_REQUEST, NO_MAPPING_ERROR, exception.getMessage());
  }

  private ResponseEntity<DomainResponse> createDomainResponse(HttpStatus status, String title, String message) {
    return new ResponseEntity<>(DomainResponse.builder()
      .reason(status.getReasonPhrase())
      .status(status.value())
      .title(title)
      .message(message)
      .build(), status);
  }
}
