package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.BUILD_INFO_PATH;
import static dev.kurama.support.TestConstant.MOCK_MVC_HOST;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.hateoas.processor.BuildInfoModelProcessor;
import dev.kurama.support.ImportMappers;
import dev.kurama.support.ImportTestSecurityConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;


@TestPropertySource(properties = {"application.version=0.0.0-SNAPSHOT", "application.run=420-1",
  "application.stage=feature", "git.branch=devops/UM-60", "git.build.time=2022-10-23T13:20:09+0200"})
@ImportTestSecurityConfiguration
@WebMvcTest(controllers = BuildInfoController.class)
@Import({BuildInfoModelProcessor.class})
@ImportMappers
class BuildInfoControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Value("${application.version:0.0.0}")
  private String version;

  @Value("${application.run:#{null}}")
  private String run;

  @Value("${application.stage:#{null}}")
  private String stage;

  @Value("${git.branch:#{null}}")
  private String branch;

  @Value("${git.build.time:#{null}}")
  private String date;


  @Test
  void should_provide_build_info_properties() {
    assertThat(version, equalTo("0.0.0-SNAPSHOT"));
    assertThat(run, equalTo("420-1"));
    assertThat(stage, equalTo("feature"));
    assertThat(branch, equalTo("devops/UM-60"));
    assertThat(date, equalTo("2022-10-23T13:20:09+0200"));
  }

  @Test
  void should_get_build_info() throws Exception {
    mockMvc.perform(get(BUILD_INFO_PATH))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$._links.self.href", equalTo(MOCK_MVC_HOST + BUILD_INFO_PATH)))
      .andExpect(jsonPath("$.version", equalTo(version)))
      .andExpect(jsonPath("$.run", equalTo(run)))
      .andExpect(jsonPath("$.stage", equalTo(stage)))
      .andExpect(jsonPath("$.branch", equalTo(branch)))
      .andExpect(jsonPath("$.date", equalTo(date)));
  }
}
