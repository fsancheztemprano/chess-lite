package dev.kurama.api.core.facade;

import static com.google.common.collect.Lists.newArrayList;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import dev.kurama.api.core.service.AuthenticationFacility;
import dev.kurama.api.core.service.UserService;
import java.io.IOException;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.hateoas.PagedModel;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserFacadeTest {

  @InjectMocks
  private UserFacade userFacade;

  @Mock
  private UserService userService;

  @Mock
  private UserMapper userMapper;

  @Mock
  private UserModelAssembler userModelAssembler;

  @Mock
  private AuthenticationFacility authenticationFacility;

  @Test
  void should_create_user() throws UsernameExistsException, EmailExistsException {
    UserInput input = UserInput.builder().username("username").build();
    User user = User.builder().username(input.getUsername()).setRandomUUID().build();
    UserModel expected = UserModel.builder().username(user.getUsername()).id(user.getId()).build();
    when(userService.createUser(input)).thenReturn(user);
    when(userMapper.userToUserModel(user)).thenReturn(expected);

    UserModel actual = userFacade.create(input);

    verify(userService).createUser(input);
    verify(userMapper).userToUserModel(user);
    assertEquals(expected, actual);
  }

  @Test
  void should_find_by_user_id() throws UserNotFoundException {
    User user = User.builder().username("username").setRandomUUID().build();
    UserModel expected = UserModel.builder().username(user.getUsername()).id(user.getId()).build();
    when(userService.findUserById(user.getId())).thenReturn(Optional.of(user));
    when(userMapper.userToUserModel(user)).thenReturn(expected);

    UserModel actual = userFacade.findByUserId(user.getId());

    verify(userService).findUserById(user.getId());
    verify(userMapper).userToUserModel(user);
    assertEquals(expected, actual);
  }

  @Test
  void should_get_all_users() {
    PageRequest PAGEABLE = PageRequest.of(1, 2);
    PageImpl<User> pagedUsers = new PageImpl<>(newArrayList(User.builder().build()), PAGEABLE, 1);
    PageImpl<UserModel> userModels = new PageImpl<>(newArrayList(UserModel.builder().build()), PAGEABLE, 1);
    PagedModel<UserModel> expected = PagedModel.of(userModels.getContent(), new PagedModel.PageMetadata(2, 1, 2));
    when(userService.getAllUsers(PAGEABLE, "")).thenReturn(pagedUsers);
    when(userMapper.userPageToUserModelPage(pagedUsers)).thenReturn(userModels);
    when(userModelAssembler.toPagedModel(userModels)).thenReturn(expected);

    PagedModel<UserModel> actual = userFacade.getAll(PAGEABLE, "");

    verify(userService).getAllUsers(PAGEABLE, "");
    verify(userMapper).userPageToUserModelPage(pagedUsers);
    verify(userModelAssembler).toPagedModel(userModels);
    assertEquals(expected, actual);
  }

  @Test
  void should_delete_by_id() throws UserNotFoundException {
    String id = randomUUID();
    userFacade.deleteById(id);

    verify(userService).deleteUserById((id));
  }

  @Test
  void should_update_user()
    throws UserNotFoundException, RoleNotFoundException, UsernameExistsException, EmailExistsException {
    String id = randomUUID();
    UserInput input = UserInput.builder().username("username").build();
    User user = User.builder().username(input.getUsername()).setRandomUUID().build();
    UserModel expected = UserModel.builder().username(user.getUsername()).id(user.getId()).build();
    when(userService.updateUser(id, input)).thenReturn(user);
    when(userMapper.userToUserModel(user)).thenReturn(expected);

    UserModel actual = userFacade.update(id, input);

    verify(userService).updateUser(id, input);
    verify(userMapper).userToUserModel(user);
    assertEquals(expected, actual);
  }

  @Test
  void should_update_user_profile()
    throws UserNotFoundException, RoleNotFoundException, UsernameExistsException, EmailExistsException {
    String id = randomUUID();
    UserProfileUpdateInput input = UserProfileUpdateInput.builder().firstname("firstname").build();
    User user = User.builder().username(input.getFirstname()).setRandomUUID().build();
    UserModel expected = UserModel.builder().username(user.getUsername()).id(user.getId()).build();
    when(userService.updateUser(eq(id), any(UserInput.class))).thenReturn(user);
    when(userMapper.userToUserModel(user)).thenReturn(expected);

    UserModel actual = userFacade.updateProfile(id, input);

    verify(userService).updateUser(eq(id), any(UserInput.class));
    verify(userMapper).userToUserModel(user);
    assertEquals(expected, actual);
  }

  @Test
  void should_change_user_password()
    throws UserNotFoundException, RoleNotFoundException, UsernameExistsException, EmailExistsException {
    String id = randomUUID();
    ChangeUserPasswordInput input = ChangeUserPasswordInput.builder()
      .password("Old_p4ss")
      .newPassword("New_p4ss")
      .build();
    User user = User.builder().id(id).username("username").build();
    UserModel expected = UserModel.builder().username(user.getUsername()).id(user.getId()).build();
    when(userService.findUserById(id)).thenReturn(Optional.of(user));
    when(userService.updateUser(eq(id), any(UserInput.class))).thenReturn(user);
    when(userMapper.userToUserModel(user)).thenReturn(expected);

    UserModel actual = userFacade.changePassword(id, input);

    verify(authenticationFacility).verifyAuthentication(user.getUsername(), input.getPassword());
    verify(userService).updateUser(eq(id), any(UserInput.class));
    verify(userMapper).userToUserModel(user);
    assertEquals(expected, actual);
  }

  @Test
  void should_upload_user_avatar()
    throws UserNotFoundException, RoleNotFoundException, UsernameExistsException, IOException, EmailExistsException {
    String id = randomUUID();
    MockMultipartFile avatar = new MockMultipartFile("avatar", "image".getBytes());
    User user = User.builder().id(id).username("username").build();
    UserModel expected = UserModel.builder().username(user.getUsername()).id(user.getId()).build();
    when(userService.updateUser(eq(id), any(UserInput.class))).thenReturn(user);
    when(userMapper.userToUserModel(user)).thenReturn(expected);

    UserModel actual = userFacade.uploadAvatar(id, avatar);

    verify(userService).updateUser(eq(id),
      argThat((UserInput input) -> "data:image/png;base64,aW1hZ2U=".equals(input.getProfileImageUrl())));
    verify(userMapper).userToUserModel(user);
    assertEquals(expected, actual);
  }

  @Test
  void should_request_user_activation_token() throws UserNotFoundException, ActivationTokenRecentException {
    String id = randomUUID();

    userFacade.requestActivationToken(id);

    verify(userService).requestActivationTokenById(id);
  }
}
