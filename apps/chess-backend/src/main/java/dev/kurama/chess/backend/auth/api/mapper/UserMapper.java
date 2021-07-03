package dev.kurama.chess.backend.auth.api.mapper;

import dev.kurama.chess.backend.auth.api.domain.input.UserInput;
import dev.kurama.chess.backend.auth.api.domain.model.UserModel;
import dev.kurama.chess.backend.auth.domain.User;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper
public interface UserMapper {

  UserModel userToUserModel(User user);

  User userInputToUser(UserInput userInput);

  List<UserModel> userListToUserModelList(List<User> users);
}
