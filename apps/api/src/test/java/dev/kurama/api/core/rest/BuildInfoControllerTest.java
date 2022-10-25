package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.BUILD_INFO_PATH;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import dev.kurama.api.core.exception.ExceptionHandlers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@TestPropertySource(properties = {"application.version=0.0.0-SNAPSHOT", "application.run=420-1",
  "application.stage=feature", "git.branch=devops/UM-60", "git.build.time=2022-10-23T13:20:09+0200"})
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = {BuildInfoController.class})
class BuildInfoControllerTest {

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

  @Autowired
  private BuildInfoController controller;

  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new ExceptionHandlers()).build();
  }

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
      .andExpect(jsonPath("$.version", equalTo(version)))
      .andExpect(jsonPath("$.run", equalTo(run)))
      .andExpect(jsonPath("$.stage", equalTo(stage)))
      .andExpect(jsonPath("$.branch", equalTo(branch)))
      .andExpect(jsonPath("$.date", equalTo(date)));
  }
}
