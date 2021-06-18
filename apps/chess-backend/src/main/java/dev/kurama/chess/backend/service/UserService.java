package dev.kurama.chess.backend.service;

import dev.kurama.chess.backend.domain.User;
import dev.kurama.chess.backend.domain.UserPrincipal;
import dev.kurama.chess.backend.repository.UserRepository;
import java.util.Date;
import javax.transaction.Transactional;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Flogger
@Service
@Transactional
@Qualifier("userDetailsService")
public class UserService implements UserDetailsService {

  private final UserRepository userRepository;

  @Autowired
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findUserByUsername(username);
    if (user == null) {
      String errorMessage = "User not found by username: " + username;
      log.atWarning().log(errorMessage);
      throw new UsernameNotFoundException(errorMessage);
    } else {
      user.setLastLoginDateDisplay(user.getLastLoginDate());
      user.setLastLoginDate(new Date());
      userRepository.save(user);
      log.atInfo().log("Found user by username: " + username);
      return new UserPrincipal(user);
    }
  }
}
