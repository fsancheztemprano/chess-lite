package dev.kurama.chess.backend.auth.facade;

import dev.kurama.chess.backend.auth.api.domain.input.ChangeUserPasswordInput;
import dev.kurama.chess.backend.auth.api.domain.input.UpdateUserProfileInput;
import dev.kurama.chess.backend.auth.api.domain.input.UserInput;
import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.api.mapper.UserMapper;
import dev.kurama.chess.backend.auth.exception.domain.EmailExistsException;
import dev.kurama.chess.backend.auth.exception.domain.UserNotFoundException;
import dev.kurama.chess.backend.auth.exception.domain.UsernameExistsException;
import dev.kurama.chess.backend.auth.service.UserService;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
public class UserFacade {

  @NonNull
  private final UserService userService;

  @NonNull
  private final UserMapper userMapper;

  @NonNull
  private final AuthenticationManager authenticationManager;

  public UserModel create(UserInput userInput) throws UsernameExistsException, EmailExistsException {
    return userMapper.userToUserModel(userService.createUser(userInput));
  }

  public UserModel findByUsername(String username) {
    return userMapper.userToUserModel(
      userService.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username)));
  }

  public Page<UserModel> getAll(Pageable pageable) {
    return userMapper.userPageToUserModelPage(userService.getAllUsers(pageable));
  }

  public UserModel update(String username, UserInput userInput)
    throws UserNotFoundException, UsernameExistsException, EmailExistsException {
    return userMapper.userToUserModel(userService.updateUser(username, userInput));
  }

  public UserModel updateProfile(String username, UpdateUserProfileInput updateUserProfileInput) {
    return userMapper.userToUserModel(
      userService.updateProfile(username, updateUserProfileInput));
  }

  public void deleteByUsername(String username) {
    userService.deleteUser(username);
  }


  public UserModel changePassword(String username, ChangeUserPasswordInput changeUserPasswordInput) {
    authenticate(username, changeUserPasswordInput.getPassword());
    return userMapper.userToUserModel(
      userService.updatePassword(username, changeUserPasswordInput.getNewPassword()));
  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }

  public UserModel uploadAvatar(String username, MultipartFile avatar) throws IOException {
    var sb = new StringBuilder();
    sb.append("data:image/png;base64,");
    sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(avatar.getBytes(), false)));
    return userMapper.userToUserModel(userService.uploadAvatar(username, sb.toString()));

  }
}
