package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.hateoas.model.UserModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

@Mapper(uses = {RoleMapper.class})
public interface UserMapper {

  @Mapping(source = "user.userPreferences.id", target = "userPreferencesId")
  UserModel userToUserModel(User user);

  default Page<UserModel> userPageToUserModelPage(Page<User> users) {
    return users.map(this::userToUserModel);
  }

  default String authorityToString(Authority authority) {
    return authority.getName();
  }
}
