package dev.kurama.api.core.hateoas.payload;

import com.google.common.collect.Lists;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.hateoas.AffordanceModel.InputPayloadMetadata;
import org.springframework.hateoas.AffordanceModel.Named;
import org.springframework.hateoas.AffordanceModel.PropertyMetadata;
import org.springframework.http.MediaType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InputPayloadMetadataImpl implements InputPayloadMetadata {

  @Builder.Default
  private final List<PropertyMetadata> metadata = Lists.newArrayList();
  @Builder.Default
  private List<MediaType> mediaTypes = Lists.newArrayList();
  @Builder.Default
  private final List<String> i18nCodes = Lists.newArrayList();

  @Override
  public <T extends Named> @NonNull T customize(@NonNull T target, @NonNull Function<PropertyMetadata, T> customizer) {
    return target;
  }

  @Override
  public @NonNull InputPayloadMetadata withMediaTypes(@NonNull List<MediaType> mediaTypes) {
    this.mediaTypes = mediaTypes;
    return this;
  }

  @Override
  public @NonNull Stream<PropertyMetadata> stream() {
    return metadata.stream();
  }

  public void addProperty(PropertyMetadata propertyMetadata) {
    metadata.add(propertyMetadata);
  }
}
