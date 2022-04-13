import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '../hal-form-client.module';
import { Link } from './link';

describe('Link', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(new Link({ href: 'http://example.com' })).toBeTruthy();
  });

  it('should create with templated href', () => {
    const link = new Link({ href: '/api/v1/users/{userId}', templated: true });
    expect(link).toBeTruthy();
    expect(link.href).toBe('/api/v1/users/{userId}');
    expect(link.templated).toBe(true);
  });

  describe('parseUrl', () => {
    it('should disregard params if not templated', () => {
      expect(new Link({ href: '/api/v1/users' }).parseUrl({ id: 'userid' })).toBe('/api/v1/users');
    });

    it('should disregard params if not needed', () => {
      expect(
        new Link({ href: '/api/v1/users/{userId}' }).parseUrl({
          userId: 'userid',
          extra: 'extra',
        }),
      ).not.toContain('extra');
    });

    it('should return null parsing a templated url with missing params', () => {
      expect(new Link({ href: '/api/v1/users/{userId}', templated: true }).parseUrl(null)).toBeNull();
    });

    it('should return templates of params not available on parsing', () => {
      expect(
        new Link({
          href: '/api/v1/users/{userId}/posts/{postId}',
          templated: true,
        }).parseUrl({ userId: 'userId' }),
      ).toBe('/api/v1/users/userId/posts/');
    });

    it('should return parsed templated url', () => {
      expect(
        new Link({
          href: '/api/v1/users/{userId}',
          templated: true,
        }).parseUrl({ userId: 'userId' }),
      ).toBe('/api/v1/users/userId');
    });

    it('should return parsed templated url with a query parameter', () => {
      expect(
        new Link({
          href: '/api/v1/users/{userId}{?locale}',
          templated: true,
        }).parseUrl({ userId: 'userId', locale: 'en' }),
      ).toBe('/api/v1/users/userId?locale=en');
    });

    it('should return parsed templated url with multiple query parameters', () => {
      expect(
        new Link({
          href: '/api/v1/users/{?locale,status}',
          templated: true,
        }).parseUrl({ userId: 'userId', locale: 'en', status: 'active' }),
      ).toBe('/api/v1/users/?locale=en&status=active');
    });

    it('should return parsed templated url with nested query parameters', () => {
      expect(
        new Link({
          href: '/api/v1/users{?locale,filters*}',
          templated: true,
        }).parseUrl({ filters: { locale: 'en', status: 'active' } }),
      ).toBe('/api/v1/users?locale=en&status=active');
    });

    it('should return parsed templated url with query parameters containing alphanumeric characters', () => {
      expect(
        new Link({
          href: '/api/v1/users{?characters}',
          templated: true,
        }).parseUrl({ characters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' }),
      ).toBe('/api/v1/users?characters=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
    });

    it('should return parsed templated url with query parameters containing special characters', () => {
      expect(
        new Link({
          href: '/api/v1/users{?characters}',
          templated: true,
        }).parseUrl({
          characters: ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ €‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿',
        }),
      ).toBe(
        '/api/v1/users?characters=%20%21%22%23%24%25%26%27%28%29%2A%2B%2C-.%2F%3A%3B%3C%3D%3E%3F%40%5B%5C%5D%5E_%60%7B%7C%7D~%20%E2%82%AC%C2%81%E2%80%9A%C6%92%E2%80%9E%E2%80%A6%E2%80%A0%E2%80%A1%CB%86%E2%80%B0%C5%A0%E2%80%B9%C5%92%C2%8D%C5%BD%C2%8F%C2%90%E2%80%98%E2%80%99%E2%80%9C%E2%80%9D%E2%80%A2%E2%80%93%E2%80%94%CB%9C%E2%84%A2%C5%A1%E2%80%BA%C5%93%C2%9D%C5%BE%C5%B8%20%C2%A1%C2%A2%C2%A3%C2%A4%C2%A5%C2%A6%C2%A7%C2%A8%C2%A9%C2%AA%C2%AB%C2%AC%C2%AD%C2%AE%C2%AF%C2%B0%C2%B1%C2%B2%C2%B3%C2%B4%C2%B5%C2%B6%C2%B7%C2%B8%C2%B9%C2%BA%C2%BB%C2%BC%C2%BD%C2%BE%C2%BF',
      );
    });

    it('should return parsed templated url with query parameters containing accented characters', () => {
      expect(
        new Link({
          href: '/api/v1/users{?characters}',
          templated: true,
        }).parseUrl({
          characters: 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ',
        }),
      ).toBe(
        '/api/v1/users?characters=%C3%80%C3%81%C3%82%C3%83%C3%84%C3%85%C3%86%C3%87%C3%88%C3%89%C3%8A%C3%8B%C3%8C%C3%8D%C3%8E%C3%8F%C3%90%C3%91%C3%92%C3%93%C3%94%C3%95%C3%96%C3%97%C3%98%C3%99%C3%9A%C3%9B%C3%9C%C3%9D%C3%9E%C3%9F%C3%A0%C3%A1%C3%A2%C3%A3%C3%A4%C3%A5%C3%A6%C3%A7%C3%A8%C3%A9%C3%AA%C3%AB%C3%AC%C3%AD%C3%AE%C3%AF%C3%B0%C3%B1%C3%B2%C3%B3%C3%B4%C3%B5%C3%B6%C3%B7%C3%B8%C3%B9%C3%BA%C3%BB%C3%BC%C3%BD%C3%BE%C3%BF',
      );
    });
  });
});
