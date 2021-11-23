package dev.kurama.api.core.mapper;

import static com.google.common.collect.Lists.newArrayList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.hateoas.model.UserModel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserMapperTest {

  @InjectMocks
  private UserMapperImpl userMapper;

  @Mock
  private RoleMapper roleMapper;

  @Test
  void userPageToUserModelPage() {
    User user1 = User.builder().setRandomUUID().username("username1").build();
    User user2 = User.builder().setRandomUUID().username("username2").build();
    PageImpl<User> page = new PageImpl<User>(newArrayList(user1, user2));

    Page<UserModel> actual = userMapper.userPageToUserModelPage(page);

    assertThat(actual.getContent()).hasSize(2)
      .extracting("id", "username")
      .contains(
        tuple(user1.getId(), user1.getUsername()),
        tuple(user2.getId(), user2.getUsername()));
  }
}
