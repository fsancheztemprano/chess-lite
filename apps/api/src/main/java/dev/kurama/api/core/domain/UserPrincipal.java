package dev.kurama.api.core.domain;

import java.util.Collection;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class UserPrincipal implements UserDetails {

  @NonNull
  private User user;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.user.getAuthorities().stream().map(Authority::getName).map(SimpleGrantedAuthority::new)
      .collect(Collectors.toList());
  }

  @Override
  public String getPassword() {
    return this.user.getPassword();
  }

  @Override
  public String getUsername() {
    return this.user.getUsername();
  }

  @Override
  public boolean isAccountNonExpired() {
    return !this.user.isExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return !this.user.isLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return !this.user.isCredentialsExpired();
  }

  @Override
  public boolean isEnabled() {
    return this.user.isActive();
  }
}
