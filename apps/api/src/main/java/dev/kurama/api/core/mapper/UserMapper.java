package dev.kurama.api.core.mapper;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.hateoas.model.UserModel;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper(uses = {RoleMapper.class, AuthorityMapper.class, UserPreferencesMapper.class})
public interface UserMapper {

  UserModel userToUserModel(User user);

  default Page<UserModel> userPageToUserModelPage(Page<User> users) {
    return users.map(this::userToUserModel);
  }
}

