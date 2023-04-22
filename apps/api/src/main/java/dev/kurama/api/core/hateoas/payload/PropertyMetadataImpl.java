package dev.kurama.api.core.hateoas.payload;

import java.util.Optional;
import lombok.Builder;
import lombok.Data;
import org.springframework.core.ResolvableType;
import org.springframework.hateoas.AffordanceModel.PropertyMetadata;

@Builder
@Data
public class PropertyMetadataImpl implements PropertyMetadata {

  private String name;
  private boolean required;
  private boolean readOnly;
  @Builder.Default
  private Optional<String> pattern = Optional.empty();
  @Builder.Default
  private ResolvableType type = ResolvableType.NONE;
  private Number min;
  private Number max;
  private Long minLength;
  private Long maxLength;
  private String inputType;
}
