package dev.kurama.api.core.service;

import static com.google.common.collect.Sets.newHashSet;
import static dev.kurama.api.core.utility.UuidUtils.randomUUID;
import static org.mockito.Mockito.verify;

import dev.kurama.api.core.repository.AuthorityRepository;
import java.util.Collection;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class AuthorityServiceTest {

  @InjectMocks
  AuthorityService authorityService;

  @Mock
  AuthorityRepository authorityRepository;

  @Test
  void should_call_repository_to_find_all_by_id() {
    Collection<String> authorityIds = newHashSet(randomUUID(), randomUUID());

    authorityService.findAllById(authorityIds);

    verify(authorityRepository).findAllByIdIn(authorityIds);
  }

  @Test
  void should_call_repository_to_get_all_authorities() {
    Pageable pageable = PageRequest.of(0, 20);

    authorityService.getAllAuthorities(pageable);

    verify(authorityRepository).findAll(pageable);
  }

  @Test
  void should_call_repository_to_find_authority_by_id() {
    String authorityId = randomUUID();

    authorityService.findAuthorityById(authorityId);

    verify(authorityRepository).findById(authorityId);
  }
}
