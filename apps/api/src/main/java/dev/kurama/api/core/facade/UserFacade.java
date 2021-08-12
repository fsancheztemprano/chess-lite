package dev.kurama.api.core.facade;

import dev.kurama.api.core.api.assembler.UserModelAssembler;
import dev.kurama.api.core.api.domain.input.ChangeUserPasswordInput;
import dev.kurama.api.core.api.domain.input.UpdateUserProfileInput;
import dev.kurama.api.core.api.domain.input.UserInput;
import dev.kurama.api.core.api.domain.model.UserModel;
import dev.kurama.api.core.api.mapper.UserMapper;
import dev.kurama.api.core.exception.domain.EmailExistsException;
import dev.kurama.api.core.exception.domain.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.UserNotFoundException;
import dev.kurama.api.core.exception.domain.UsernameExistsException;
import dev.kurama.api.core.service.UserService;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.PagedModel;
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
  private final UserModelAssembler userModelAssembler;

  @NonNull
  private final AuthenticationManager authenticationManager;

  public UserModel create(UserInput userInput) throws UsernameExistsException, EmailExistsException {
    return userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.createUser(userInput)));
  }

  public UserModel findByUsername(String username) {
    return userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username))));
  }

  public UserModel findByUserId(String userId) {
    return userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.findUserById(userId).orElseThrow()));
  }

  public PagedModel<UserModel> getAll(Pageable pageable) {
    return userModelAssembler.toPagedModel(
      userMapper.userPageToUserModelPage(
        userService.getAllUsers(pageable)));
  }

  public UserModel update(String id, UserInput userInput)
    throws UsernameExistsException, EmailExistsException, UserNotFoundException, RoleNotFoundException {
    return userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.updateUser(id, userInput)));
  }

  public UserModel updateProfile(String username, UpdateUserProfileInput updateUserProfileInput) {
    return userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.updateProfile(username, updateUserProfileInput)));
  }

  public void deleteByUsername(String username) {
    userService.deleteUserByUsername(username);
  }

  public void deleteById(String id) {
    userService.deleteUserById(id);
  }

  public UserModel changePassword(String username, ChangeUserPasswordInput changeUserPasswordInput) {
    authenticate(username, changeUserPasswordInput.getPassword());
    return userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.updatePassword(username, changeUserPasswordInput.getNewPassword())));
  }

  public UserModel uploadAvatar(String username, MultipartFile avatar) throws IOException {
    var sb = new StringBuilder();
    sb.append("data:image/png;base64,");
    sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(avatar.getBytes(), false)));
    return userModelAssembler.toModel(userMapper.userToUserModel(userService.uploadAvatar(username, sb.toString())));

  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }
}
