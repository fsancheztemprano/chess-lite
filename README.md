<!-- PROJECT SHIELDS -->

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=frango9000_board-games)

![Development](https://github.com/frango9000/board-games/actions/workflows/verify.yml/badge.svg)
[![codecov](https://codecov.io/gh/frango9000/board-games/branch/development/graph/badge.svg?token=5N7AH4BAHQ)](https://codecov.io/gh/frango9000/board-games)

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/frango9000/board-games">

[comment]: <> ( <img src="./images/logo.png" alt="Logo" width="80" height="80">)
</a>

</p>

<h3 align="center">Board Games</h3>

<p align="center">
  An application with jwt authentication, and user management.
  <br />
  <a href="https://github.com/frango9000/board-games"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://boiling-shore-06894.herokuapp.com/app/home">View Demo</a>
  ·
  <a href="https://github.com/frango9000/board-games/issues">Report Bug</a>
  ·
  <a href="https://github.com/frango9000/board-games/issues">Request Feature</a>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#building">Building</a></li>
    <li><a href="#Deploying">Deploying</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project ⌨️

### Built With 🛠️

- [OpenJDK 11](https://adoptopenjdk.net/) - Open Java
- [Maven](https://maven.apache.org/) - Dependencies Management
- [Spring](https://spring.io/) - Framework
- [Node.js](http://nodejs.org/) - Runtime Environment
- [Yarn](https://yarnpkg.com/) - NodeJS Package Manager
- [Angular](https://angular.io/) - Framework
- [Nx](https://nx.dev/angular) - Nx Workspace
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) - IDE

<!-- GETTING STARTED -->

## Getting Started 🚀

To get a local copy up and running follow these simple steps.

### Prerequisites 📋

- Java 11
- Node 14
- Docker

### Installation 🔧

1. Clone the repo
   ```sh
   git clone https://github.com/frango9000/board-games.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<!-- USAGE EXAMPLES -->

## Usage 🏹

Use this space to show useful examples of how a project can be used. Additional screenshots, code
examples and demos
work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<!-- TESTING -->

## Testing ⚙️

Explain how to run the automated tests for this system

Test Backend

```
npm run test:backend
```

or

```
cd apps/api
.\mvn test
```

Test Frontend

```
npm run test:frontend
```

Test All

```
npm run test
```

E2E

```
npm run e2e
```

And coding style tests

```
npm run lint
npm run format:check
```

<!-- BUILDING -->

## Building 🛠️

Build Backend

```
npm run build:build
```

Build Frontend

```
npm run build:frontend
```

Create Jar Package (Front+Back)

```
npm run package
```

or

```
cd apps/api
.\mvn clean package -P frontend
```

<!-- DEPLOYING -->

## Deploying 📦

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/frango9000/board-games/issues) for a list of
proposed features (and
known issues).

<!-- CONTRIBUTING -->

## Contributing 🖇️

Contributions are what make the open source community such an amazing place to be learn, inspire,
and create. Any
contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License 📄

## Wiki 📖

More info on the project can be found in
our [Wiki](https://github.com/frango9000/board-games/wiki)

<!-- CONTACT -->

## Contact ✒️

- **[Francisco Sanchez](https://frango9000.github.io/)**

[![Email][email-contact-shield]][email-contact-url]
[![Github][github-contact-shield]][github-contact-url]
[![LinkedIn][linkedin-contact-shield]][linkedin-contact-url]

<!-- SHARE -->

## Share 🔗

[![Email][email-share-shield]][email-share-url]
[![LinkedIn][linkedin-share-shield]][linkedin-share-url]
[![Facebook][facebook-share-shield]][facebook-share-url]
[![Twitter][twitter-share-shield]][twitter-share-url]

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements 🎁

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-contact-shield]: https://img.shields.io/badge/-LinkedIn-black?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-contact-url]: https://www.linkedin.com/in/frango9000/

[github-contact-shield]: https://img.shields.io/badge/-Github-black?style=for-the-badge&logo=github&colorB=555

[github-contact-url]: https://github.com/frango9000

[email-contact-shield]: https://img.shields.io/badge/-email-black.svg?style=for-the-badge&colorB=555

[email-contact-url]: mailto:frango9000@gmail.com

[linkedin-share-shield]: https://img.shields.io/badge/Share-Linkedin?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-share-url]: https://www.linkedin.com/shareArticle?mini=true&url=https://github.com/frango9000/board-games

[facebook-share-shield]: https://img.shields.io/badge/Share-Facebook?style=for-the-badge&logo=facebook&colorB=555

[facebook-share-url]: https://www.facebook.com/sharer/sharer.php?u=https://github.com/frango9000/board-games

[twitter-share-shield]: https://img.shields.io/badge/Share-Twitter?style=for-the-badge&logo=twitter&colorB=555

[twitter-share-url]: https://twitter.com/intent/tweet?url=https://github.com/frango9000/board-games&text=Check%20this%20project%20out

[email-share-shield]: https://img.shields.io/badge/-email-black.svg?style=for-the-badge&colorB=555

[email-share-url]: mailto:info@example.com?&subject=&cc=&bcc=&body=Check%20this%20project%20out%20https://github.com/frango9000/board-games
