package dev.kurama.api.core.domain;

import com.google.common.collect.Sets;
import java.io.Serializable;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
public class Authority extends AbstractEntity implements Serializable {

  @NonNull
  private String name;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @ManyToMany(mappedBy = "authorities", fetch = FetchType.LAZY)
  private Set<User> users = Sets.newHashSet();

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @ManyToMany(mappedBy = "authorities", fetch = FetchType.LAZY)
  @Builder.Default
  private Set<Role> roles = Sets.newHashSet();
}
