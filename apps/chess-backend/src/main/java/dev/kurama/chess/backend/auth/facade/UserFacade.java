package dev.kurama.chess.backend.auth.facade;

import dev.kurama.chess.backend.auth.domain.User;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.rest.input.UserInput;
import dev.kurama.chess.backend.auth.service.UserService;
import java.util.List;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserFacade {

  @NonNull
  private final UserService userService;

  public User createUser(UserInput user) throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return userService.createUser(user);
  }

  public User getUser(String username) {
    return userService.findUserByUsername(username);
  }

  public List<User> getAllUsers() {
    return userService.getAllUsers();
  }

  public User updateUser(String username, UserInput user)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return userService.updateUser(username, user);
  }

  public void deleteUser(String username) {
    userService.deleteUser(username);
  }
}
