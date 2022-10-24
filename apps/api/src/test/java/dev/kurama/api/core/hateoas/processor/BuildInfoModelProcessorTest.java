package dev.kurama.api.core.hateoas.processor;

import static dev.kurama.api.core.constant.RestPathConstant.BUILD_INFO_PATH;
import static dev.kurama.api.core.hateoas.relations.HateoasRelations.SELF;
import static org.assertj.core.api.Assertions.assertThat;

import dev.kurama.api.core.hateoas.model.BuildInfoModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BuildInfoModelProcessorTest {

  private BuildInfoModelProcessor processor;

  private BuildInfoModel model;

  @BeforeEach
  void setUp() {
    processor = new BuildInfoModelProcessor();

    model = BuildInfoModel.builder().version("0.0.0-SNAPSHOT").run("420-1").stage("feature")
        .branch("devops/UM-60").date("2022-10-23T13:20:09+0200").build();
  }

  @Test
  void should_have_self_link() {
    BuildInfoModel actual = processor.process(model);

    assertThat(actual.getLinks()).hasSize(1);
    assertThat(actual.getLink(SELF)).isPresent()
        .hasValueSatisfying(link -> assertThat(link.getHref()).isEqualTo(BUILD_INFO_PATH));
  }

}
