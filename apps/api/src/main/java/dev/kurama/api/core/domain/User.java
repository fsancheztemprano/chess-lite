package dev.kurama.api.core.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Sets;
import dev.kurama.api.ttt.player.TicTacToePlayer;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
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
public class User extends AbstractEntity implements Serializable {

  private String firstname;
  private String lastname;
  private String username;
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;
  private String email;
  @Column(length = 32768)
  private String profileImageUrl;
  private Date lastLoginDate;
  private Date lastLoginDateDisplay;
  private Date joinDate;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  private Role role;


  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @Builder.Default
  @ManyToMany
  @JoinTable(name = "user_authorities", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
             inverseJoinColumns = @JoinColumn(name = "authority_id", referencedColumnName = "id"))
  private Set<Authority> authorities = Sets.newHashSet();

  private boolean active;
  private boolean locked;
  private boolean expired;
  private boolean credentialsExpired;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
  private UserPreferences userPreferences;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
  private ActivationToken activationToken;

  @ToString.Exclude
  @EqualsAndHashCode.Exclude
  @OneToOne(mappedBy = "user", orphanRemoval = false, optional = true)
  private TicTacToePlayer ticTacToePlayer;
}
