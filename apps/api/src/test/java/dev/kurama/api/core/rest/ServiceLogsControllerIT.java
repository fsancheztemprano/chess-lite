package dev.kurama.api.core.rest;

import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_DELETE;
import static dev.kurama.api.core.authority.ServiceLogsAuthority.SERVICE_LOGS_READ;
import static dev.kurama.api.core.constant.RestPathConstant.SERVICE_LOGS_PATH;
import static dev.kurama.api.support.TestUtils.getAuthorizationHeader;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.facade.ServiceLogsFacade;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.hateoas.processor.ServiceLogsModelProcessor;
import dev.kurama.api.core.service.ServiceLogsService;
import dev.kurama.api.core.utility.JWTTokenProvider;
import dev.kurama.api.support.ImportMappers;
import dev.kurama.api.support.ImportTestSecurityConfiguration;
import java.util.Date;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;


@ImportTestSecurityConfiguration
@WebMvcTest(controllers = ServiceLogsController.class)
@Import({ServiceLogsFacade.class, ServiceLogsModelProcessor.class})
@ImportMappers
class ServiceLogsControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private JWTTokenProvider jwtTokenProvider;

  @MockBean
  private ServiceLogsService serviceLogsService;

  @Nested
  class GetServiceLogsITs {

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(get(SERVICE_LOGS_PATH)).andExpect(status().isForbidden());
    }

    @Test
    void should_return_authentication_without_service_logs_read_authorization() throws Exception {
      mockMvc.perform(get(SERVICE_LOGS_PATH).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isUnauthorized());
    }

    @Test
    void should_get_service_logs() throws Exception {
      ServiceLogsModel expected = ServiceLogsModel.builder().logs("logs").timestamp(new Date()).build();
      doReturn(expected).when(serviceLogsService).getServiceLogs();

      mockMvc.perform(get(SERVICE_LOGS_PATH).headers(getAuthorizationHeader(jwtTokenProvider, SERVICE_LOGS_READ)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.logs", equalTo(expected.getLogs())));
    }
  }

  @Nested
  class DeleteServiceLogsITs {

    @Test
    void should_return_forbidden_without_authentication() throws Exception {
      mockMvc.perform(delete(SERVICE_LOGS_PATH)).andExpect(status().isForbidden());
    }

    @Test
    void should_return_unauthorized_without_service_logs_read_authorization() throws Exception {
      mockMvc.perform(delete(SERVICE_LOGS_PATH).headers(getAuthorizationHeader(jwtTokenProvider, "MOCK:AUTH")))
        .andExpect(status().isUnauthorized());
    }

    @Test
    void should_delete_service_logs() throws Exception {
      ServiceLogsModel expected = ServiceLogsModel.builder().logs("").timestamp(new Date()).build();
      doReturn(expected).when(serviceLogsService).deleteServiceLogs();

      mockMvc.perform(delete(SERVICE_LOGS_PATH).headers(getAuthorizationHeader(jwtTokenProvider, SERVICE_LOGS_DELETE)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.logs", equalTo(expected.getLogs())));
    }
  }
}
