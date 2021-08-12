package dev.kurama.api.auth.api.mapper;

import dev.kurama.api.auth.api.domain.model.UserModel;
import dev.kurama.api.auth.domain.Authority;
import dev.kurama.api.auth.domain.User;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper(uses = RoleMapper.class)
public interface UserMapper {

  UserModel userToUserModel(User user);

  default Page<UserModel> userPageToUserModelPage(Page<User> users) {
    return users.map(this::userToUserModel);
  }

  default String authorityToString(Authority authority) {
    return authority.getName();
  }
}
