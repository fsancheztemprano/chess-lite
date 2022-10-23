package dev.kurama.api.core.hateoas.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.hateoas.RepresentationModel;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BuildInfoModel extends RepresentationModel<BuildInfoModel> {

  private String branch;
  private String date;
  private String run;
  private String stage;
  private String version;
}
