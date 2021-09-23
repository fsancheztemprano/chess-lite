package dev.kurama.api.core.facade;

import dev.kurama.api.core.event.domain.UserModelEvent;
import dev.kurama.api.core.event.domain.UserModelEvent.UserModelEventAction;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.EmailExistsException;
import dev.kurama.api.core.exception.domain.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.UserNotFoundException;
import dev.kurama.api.core.exception.domain.UsernameExistsException;
import dev.kurama.api.core.hateoas.assembler.UserModelAssembler;
import dev.kurama.api.core.hateoas.input.ChangeUserPasswordInput;
import dev.kurama.api.core.hateoas.input.UpdateUserProfileInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.mapper.UserMapper;
import dev.kurama.api.core.service.UserService;
import java.io.IOException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.springframework.context.ApplicationEventPublisher;
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

  @NonNull
  private final ApplicationEventPublisher applicationEventPublisher;


  public UserModel create(UserInput userInput) throws UsernameExistsException, EmailExistsException {
    UserModel userModel = userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.createUser(userInput)));
    sendUserModelEvent(userModel.getId(), UserModelEventAction.CREATED);
    return userModel;
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
    UserModel userModel = userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.updateUser(id, userInput)));
    sendUserModelEvent(userModel.getId(), UserModelEventAction.UPDATED);
    return userModel;
  }

  public UserModel updateProfile(String username, UpdateUserProfileInput updateUserProfileInput) {
    UserModel userModel = userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.updateProfile(username, updateUserProfileInput)));
    sendUserModelEvent(userModel.getId(), UserModelEventAction.UPDATED);
    return userModel;
  }

  public void deleteByUsername(String username) {
    String userId = userService.deleteUserByUsername(username);
    sendUserModelEvent(userId, UserModelEventAction.DELETED);
  }

  public void deleteById(String id) throws UserNotFoundException {
    userService.deleteUserById(id);
    sendUserModelEvent(id, UserModelEventAction.DELETED);
  }

  public UserModel changePassword(String username, ChangeUserPasswordInput changeUserPasswordInput) {
    authenticate(username, changeUserPasswordInput.getPassword());
    return userModelAssembler.toModel(
      userMapper.userToUserModel(
        userService.updatePassword(username, changeUserPasswordInput.getNewPassword())));
  }

  public UserModel uploadAvatar(String username, MultipartFile avatar) throws IOException {
    String sb = "data:image/png;base64,"
      + StringUtils.newStringUtf8(Base64.encodeBase64(avatar.getBytes(), false));
    UserModel userModel = userModelAssembler.toModel(
      userMapper.userToUserModel(userService.uploadAvatar(username, sb)));
    sendUserModelEvent(userModel.getId(), UserModelEventAction.UPDATED);
    return userModel;
  }

  public void requestActivationToken(String id) throws UserNotFoundException, ActivationTokenRecentException {
    userService.requestActivationTokenById(id);
  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }

  private void sendUserModelEvent(String userId, UserModelEventAction action) {
    applicationEventPublisher.publishEvent(
      UserModelEvent.builder()
        .userId(userId)
        .action(action)
        .build());
  }
}
