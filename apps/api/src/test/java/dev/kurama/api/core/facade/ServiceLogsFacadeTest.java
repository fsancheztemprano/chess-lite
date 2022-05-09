package dev.kurama.api.core.facade;

import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.service.ServiceLogsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class ServiceLogsFacadeTest {

  @InjectMocks
  private ServiceLogsFacade serviceLogsFacade;

  @Mock
  private ServiceLogsService serviceLogsService;

  @Test
  void should_get_service_logs() {
    ServiceLogsModel expected = ServiceLogsModel.builder().logs(randomAlphanumeric(8)).build();
    when(serviceLogsService.getServiceLogs()).thenReturn(expected);

    ServiceLogsModel actual = serviceLogsFacade.getServiceLogs();

    verify(serviceLogsService).getServiceLogs();
    assertEquals(actual, expected);
  }

  @Test
  void should_delete_service_logs() {
    ServiceLogsModel expected = ServiceLogsModel.builder().logs("").build();
    when(serviceLogsService.deleteServiceLogs()).thenReturn(expected);

    ServiceLogsModel actual = serviceLogsFacade.deleteServiceLogs();

    verify(serviceLogsService).deleteServiceLogs();
    assertEquals(actual, expected);
  }
}
