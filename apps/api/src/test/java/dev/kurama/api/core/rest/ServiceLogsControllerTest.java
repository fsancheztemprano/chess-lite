package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.SERVICE_LOGS_PATH;
import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import dev.kurama.api.core.facade.ServiceLogsFacade;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.rest.ServiceLogsControllerTest.ServiceLogsControllerConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {ServiceLogsController.class})
@Import(ServiceLogsControllerConfig.class)
class ServiceLogsControllerTest {

  @Autowired
  private ServiceLogsFacade facade;

  @Autowired
  private ServiceLogsController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ExceptionHandlers()).build();
  }

  @Test
  void should_get_service_logs() throws Exception {
    ServiceLogsModel expected = ServiceLogsModel.builder().logs(randomAlphanumeric(8)).build();
    when(facade.getServiceLogs()).thenReturn(expected);

    mockMvc.perform(get(SERVICE_LOGS_PATH))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.logs", equalTo(expected.getLogs())));
  }

  @Test
  void should_delete_service_logs() throws Exception {
    ServiceLogsModel expected = ServiceLogsModel.builder().logs("").build();
    when(facade.deleteServiceLogs()).thenReturn(expected);

    mockMvc.perform(delete(SERVICE_LOGS_PATH))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.logs", equalTo(expected.getLogs())));
  }

  @TestConfiguration
  protected static class ServiceLogsControllerConfig {

    @Bean
    public ServiceLogsFacade ServiceLogsFacade() {
      return Mockito.mock(ServiceLogsFacade.class);
    }
  }
}
