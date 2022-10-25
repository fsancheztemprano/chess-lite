package dev.kurama.api.core.rest;

import static dev.kurama.api.core.constant.RestPathConstant.BUILD_INFO_PATH;
import static org.springframework.http.ResponseEntity.ok;

import dev.kurama.api.core.hateoas.model.BuildInfoModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(BUILD_INFO_PATH)
public class BuildInfoController {

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

  @GetMapping()
  public ResponseEntity<BuildInfoModel> get() {
    return ok().body(BuildInfoModel.builder()
      .branch(branch)
      .date(date)
      .run(!run.equals("@project.run@") ? run : null)
      .stage(!stage.equals("@project.stage@") ? stage : null)
      .version(version)
      .build());
  }

}
