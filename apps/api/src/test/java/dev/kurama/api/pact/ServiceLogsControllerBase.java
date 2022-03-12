package dev.kurama.api.pact;

import static org.mockito.Mockito.doReturn;

import dev.kurama.api.core.facade.ServiceLogsFacade;
import dev.kurama.api.core.hateoas.model.ServiceLogsModel;
import dev.kurama.api.core.hateoas.processor.ServiceLogsModelProcessor;
import dev.kurama.api.core.rest.ServiceLogsController;
import dev.kurama.api.core.service.ServiceLogsService;
import dev.kurama.support.ImportMappers;
import java.util.Date;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;

@WebMvcTest(controllers = ServiceLogsController.class)
@Import({ServiceLogsFacade.class, ServiceLogsModelProcessor.class})
@ImportMappers
public class ServiceLogsControllerBase extends PactBase {

  @MockBean
  private ServiceLogsService serviceLogsService;

  @Override
  protected void beforeEach() throws Exception {
    ServiceLogsModel serviceLogs = ServiceLogsModel.builder().logs("logs...").timestamp(new Date()).build();

    doReturn(serviceLogs).when(serviceLogsService).getServiceLogs();
    doReturn(serviceLogs).when(serviceLogsService).deleteServiceLogs();
  }
}
