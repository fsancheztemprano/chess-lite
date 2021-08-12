package dev.kurama.api.auth.domain;

import com.google.common.collect.Sets;
import dev.kurama.api.core.domain.AbstractEntity;
import java.io.Serializable;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
public class Role extends AbstractEntity implements Serializable {

  private String name;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
  private Set<User> users = Sets.newHashSet();

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
    name = "role_authorities",
    joinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"),
    inverseJoinColumns = @JoinColumn(name = "authority_id", referencedColumnName = "id")
  )
  private Set<Authority> authorities = Sets.newHashSet();
}
