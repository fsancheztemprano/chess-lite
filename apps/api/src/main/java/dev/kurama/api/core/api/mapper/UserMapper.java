package dev.kurama.api.core.api.mapper;

import dev.kurama.api.core.api.domain.model.UserModel;
import dev.kurama.api.core.domain.Authority;
import dev.kurama.api.core.domain.User;
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
