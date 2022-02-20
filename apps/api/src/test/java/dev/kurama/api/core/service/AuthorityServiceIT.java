package dev.kurama.api.core.service;

import dev.kurama.api.BackendApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles(value = "data-jpa")
@SpringBootTest(classes = {BackendApplication.class})
class AuthorityServiceIT {

}
