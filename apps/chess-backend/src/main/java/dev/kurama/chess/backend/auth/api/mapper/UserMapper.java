package dev.kurama.chess.backend.auth.api.mapper;

import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.domain.User;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper
public interface UserMapper {

  UserModel userToUserModel(User user);

  default Page<UserModel> userPageToUserModelPage(Page<User> users) {
    return users.map(this::userToUserModel);
  }
}
