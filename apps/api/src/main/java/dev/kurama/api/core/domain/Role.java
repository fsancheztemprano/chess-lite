package dev.kurama.api.core.domain;

import com.google.common.collect.Sets;
import jakarta.persistence.Cacheable;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import java.io.Serializable;
import java.util.Set;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@SuperBuilder
@Getter
@Setter
@ToString
@NoArgsConstructor
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
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
  @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "role_authorities", joinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"),
             inverseJoinColumns = @JoinColumn(name = "authority_id", referencedColumnName = "id"))
  private Set<Authority> authorities = Sets.newHashSet();

  @Builder.Default
  private boolean coreRole = false;

  @Builder.Default
  private boolean canLogin = false;

}
