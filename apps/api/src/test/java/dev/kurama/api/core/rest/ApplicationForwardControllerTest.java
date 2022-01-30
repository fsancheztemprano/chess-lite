//package dev.kurama.api.core.rest;
//
//import static com.google.common.collect.Sets.newHashSet;
//import static org.apache.commons.lang3.RandomStringUtils.randomAlphanumeric;
//import static org.apache.commons.lang3.tuple.Pair.of;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//import java.util.Set;
//import java.util.stream.Stream;
//import org.apache.commons.lang3.tuple.Pair;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.junit.jupiter.api.extension.ExtensionContext;
//import org.junit.jupiter.params.ParameterizedTest;
//import org.junit.jupiter.params.provider.Arguments;
//import org.junit.jupiter.params.provider.ArgumentsProvider;
//import org.junit.jupiter.params.provider.ArgumentsSource;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//@ExtendWith(SpringExtension.class)
//@ContextConfiguration(classes = {ApplicationForwardController.class})
//class ApplicationForwardControllerTest {
//
//  @Autowired
//  private ApplicationForwardController controller;
//
//  private MockMvc mockMvc;
//
//  @BeforeEach
//  void setUp() {
//    mockMvc = MockMvcBuilders.standaloneSetup(controller)
//                             .build();
//  }
//
//  @DisplayName("Route endpoint should not forward")
//  @ParameterizedTest(name = "when someone requests \"{0}\"")
//  @ArgumentsSource(RouteShouldNotForwardArgumentsProvider.class)
//  void route_should_not_forward_if_someone_requests(String path) throws Exception {
//    mockMvc.perform(get("/app/" + path))
//           .andExpect(status().isOk())
//           .andExpect(forwardedUrl(null));
//  }
//
//  static class RouteShouldNotForwardArgumentsProvider implements ArgumentsProvider {
//
//    @Override
//    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
//      Set<String> mainFiles = newHashSet("index.html", "favicon.ico");
//
//      Set<Pair<String, String>> hashCodedFiles = newHashSet(of("main", "js"), of("polyfills", "js"),
//                                                            of("runtime", "js"), of("styles", "css"),
//                                                            of("common", "js"));
//
//      Set<Pair<String, String>> hashCodedModules = newHashSet(of("1", "js"), of("9", "js"), of("99", "js"),
//                                                              of("999", "js"), of("9999", "js"));
//
//      Set<String> assetsFolder = newHashSet("assets/i18n/en.json", "assets/i18n/es.json", "assets/flags/es.png");
//
//      return Stream.concat(Stream.concat(Stream.concat(mainFiles.stream(), hashCodedFiles.stream()
//                                                                                         .map(
//                                                                                           this::getHashCodedFilename)),
//                                         hashCodedModules.stream()
//                                                         .map(this::getHashCodedFilename)), assetsFolder.stream())
//                   .map(Arguments::arguments);
//    }
//
//    private String getHashCodedFilename(Pair<String, String> pair) {
//      return String.format("%s.%s.%s", pair.getLeft(), randomAlphanumeric(16), pair.getRight());
//    }
//  }
//}
