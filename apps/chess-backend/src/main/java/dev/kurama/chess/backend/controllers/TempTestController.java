package dev.kurama.chess.backend.controllers;

import dev.kurama.chess.backend.exception.ExceptionHandlers;
import dev.kurama.chess.backend.exception.domain.EmailNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/greeting")
public class TempTestController extends ExceptionHandlers {

  @GetMapping()
  public String greeting(@RequestParam(name = "name", required = false, defaultValue = "World") String name)
    throws EmailNotFoundException {
    return "greetings " + name;
//    throw new EmailNotFoundException("Testsss");
  }

}
