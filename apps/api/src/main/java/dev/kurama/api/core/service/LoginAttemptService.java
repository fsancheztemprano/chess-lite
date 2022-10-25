package dev.kurama.api.core.service;

import static java.util.concurrent.TimeUnit.MINUTES;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import java.util.concurrent.ExecutionException;
import org.springframework.stereotype.Service;

@Service
public class LoginAttemptService {

  public static final int MAXIMUM_NUMBER_OF_ATTEMPTS = 5;
  private static final int ATTEMPT_INCREMENT = 1;
  private final LoadingCache<String, Integer> loginAttemptCache;

  public LoginAttemptService() {
    super();
    this.loginAttemptCache = CacheBuilder.newBuilder()
      .expireAfterWrite(15, MINUTES)
      .maximumSize(100)
      .build(new CacheLoader<String, Integer>() {
        public Integer load(String key) {
          return 0;
        }
      });
  }

  public void evictUserFromLoginAttemptCache(String username) {
    loginAttemptCache.invalidate(username);
  }

  public void addUserToLoginAttemptCache(String username) {
    var attempts = 0;
    try {
      attempts = ATTEMPT_INCREMENT + loginAttemptCache.get(username);
    } catch (ExecutionException ignored) {
    }
    loginAttemptCache.put(username, attempts);
  }

  public boolean hasExceededMaxAttempts(String username) {
    try {
      return loginAttemptCache.get(username) >= MAXIMUM_NUMBER_OF_ATTEMPTS;
    } catch (ExecutionException ignored) {
    }
    return false;
  }
}
