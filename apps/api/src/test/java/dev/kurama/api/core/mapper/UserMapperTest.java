package dev.kurama.api.core.mapper;

import static com.google.common.collect.Lists.newArrayList;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.tuple;
import static org.junit.jupiter.api.Assertions.assertNull;

import dev.kurama.api.core.domain.User;
import dev.kurama.api.core.hateoas.model.UserModel;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class UserMapperTest {

  @SuppressWarnings("SpringJavaAutowiredMembersInspection")
  @Autowired
  private UserMapper mapper;

  @Test
  void should_return_null_when_user_is_null() {
    assertNull(mapper.userToUserModel(null));
  }

  @Test
  void user_to_user_model() {
    User user = User.builder()
      .setRandomUUID()
      .username(randomAlphanumeric(8))
      .email(randomAlphanumeric(8))
      .firstname(randomAlphanumeric(8))
      .lastname(randomAlphanumeric(8))
      .profileImageUrl(randomAlphanumeric(8))
      .locked(false)
      .active(false)
      .expired(false)
      .build();

    UserModel actual = mapper.userToUserModel(user);

    assertThat(actual).hasFieldOrPropertyWithValue("id", user.getId())
      .hasFieldOrPropertyWithValue("username", user.getUsername())
      .hasFieldOrPropertyWithValue("email", user.getEmail())
      .hasFieldOrPropertyWithValue("firstname", user.getFirstname())
      .hasFieldOrPropertyWithValue("lastname", user.getLastname())
      .hasFieldOrPropertyWithValue("profileImageUrl", user.getProfileImageUrl())
      .hasFieldOrPropertyWithValue("locked", user.isLocked())
      .hasFieldOrPropertyWithValue("active", user.isActive())
      .hasFieldOrPropertyWithValue("expired", user.isExpired());
  }

  @Test
  void userPageToUserModelPage() {
    User user1 = User.builder()
      .setRandomUUID()
      .username("username1")
      .build();
    User user2 = User.builder()
      .setRandomUUID()
      .username("username2")
      .build();
    PageImpl<User> page = new PageImpl<User>(newArrayList(user1, user2));

    Page<UserModel> actual = mapper.userPageToUserModelPage(page);

    assertThat(actual.getContent()).hasSize(2)
      .extracting("id", "username")
      .contains(tuple(user1.getId(), user1.getUsername()), tuple(user2.getId(), user2.getUsername()));
  }

  @TestConfiguration
  protected static class UserMapperConfig {

    @Bean
    public UserMapper userMapper() {
      return Mappers.getMapper(UserMapper.class);
    }

    @Bean
    public RoleMapper roleMapper() {
      return Mappers.getMapper(RoleMapper.class);
    }

    @Bean
    public AuthorityMapper authorityMapper() {
      return Mappers.getMapper(AuthorityMapper.class);
    }

    @Bean
    public UserPreferencesMapper userPreferencesMapper() {
      return Mappers.getMapper(UserPreferencesMapper.class);
    }
  }
}
