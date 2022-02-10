package dev.kurama.api.core.facade;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.exception.domain.ActivationTokenRecentException;
import dev.kurama.api.core.exception.domain.exists.EmailExistsException;
import dev.kurama.api.core.exception.domain.exists.UsernameExistsException;
import dev.kurama.api.core.exception.domain.not.found.RoleNotFoundException;
import dev.kurama.api.core.exception.domain.not.found.UserNotFoundException;
import dev.kurama.api.core.hateoas.assembler.UserModelAssembler;
import dev.kurama.api.core.hateoas.input.ChangeUserPasswordInput;
import dev.kurama.api.core.hateoas.input.UserInput;
import dev.kurama.api.core.hateoas.input.UserProfileUpdateInput;
import dev.kurama.api.core.hateoas.model.UserModel;
import dev.kurama.api.core.mapper.UserMapper;
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
    return userMapper.userToUserModel(userService.createUser(userInput));
  }

  public UserModel findByUserId(String userId) throws UserNotFoundException {
    return userMapper.userToUserModel(
      userService.findUserById(userId).orElseThrow(() -> new UserNotFoundException(userId)));
  }

  public PagedModel<UserModel> getAll(Pageable pageable, String search) {
    return userModelAssembler.toPagedModel(
      userMapper.userPageToUserModelPage(
        userService.getAllUsers(pageable, search)));
  }

  public void deleteById(String id) throws UserNotFoundException {
    userService.deleteUserById(id);
  }

  public UserModel update(String id, UserInput userInput)
    throws UsernameExistsException, EmailExistsException, UserNotFoundException, RoleNotFoundException {
    return userMapper.userToUserModel(userService.updateUser(id, userInput));
  }

  public UserModel updateProfile(String id, UserProfileUpdateInput userProfileUpdateInput)
    throws UserNotFoundException, RoleNotFoundException, UsernameExistsException, EmailExistsException {
    return userMapper.userToUserModel(userService.updateUser(id,
      UserInput.builder()
        .firstname(userProfileUpdateInput.getFirstname())
        .lastname(userProfileUpdateInput.getLastname()).build()));
  }

  public UserModel changePassword(String id, ChangeUserPasswordInput changeUserPasswordInput)
    throws UserNotFoundException, RoleNotFoundException, UsernameExistsException, EmailExistsException {
    User user = userService.findUserById(id).orElseThrow(() -> new UserNotFoundException(id));
    authenticate(user.getUsername(), changeUserPasswordInput.getPassword());
    return userMapper.userToUserModel(
      userService.updateUser(id, UserInput.builder().password(changeUserPasswordInput.getNewPassword()).build()));
  }

  public UserModel uploadAvatar(String id, MultipartFile avatar)
    throws IOException, UserNotFoundException, RoleNotFoundException, UsernameExistsException, EmailExistsException {
    String sb = "data:image/png;base64,"
      + StringUtils.newStringUtf8(Base64.encodeBase64(avatar.getBytes(), false));
    return userMapper.userToUserModel(
      userService.updateUser(id, UserInput.builder().profileImageUrl(sb).build()));
  }

  public void requestActivationToken(String id) throws UserNotFoundException, ActivationTokenRecentException {
    userService.requestActivationTokenById(id);
  }

  private void authenticate(String username, String password) {
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
  }
}
