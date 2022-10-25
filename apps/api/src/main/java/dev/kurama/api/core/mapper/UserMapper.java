package dev.kurama.api.core.mapper;

import static dev.kurama.api.core.utility.HttpUtils.getJwtHeaders;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.domain.support.AuthenticatedUser;
import dev.kurama.api.core.hateoas.model.AuthenticatedUserModel;
import dev.kurama.api.core.hateoas.model.UserModel;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper(uses = {RoleMapper.class, AuthorityMapper.class, UserPreferencesMapper.class})
public interface UserMapper {

  UserModel userToUserModel(User user);

  default AuthenticatedUserModel authenticatedUserToModel(AuthenticatedUser authenticatedUser) {
    return AuthenticatedUserModel.builder()
      .userModel(userToUserModel(authenticatedUser.getUser()))
      .headers(getJwtHeaders(authenticatedUser.getToken(), authenticatedUser.getRefreshToken()))
      .build();
  }

  default Page<UserModel> userPageToUserModelPage(Page<User> users) {
    return users.map(this::userToUserModel);
  }
}

