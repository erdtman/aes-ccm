#include <node.h>
#include <node_buffer.h>
#include <openssl/evp.h>

namespace node_aes_ccm {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::MaybeLocal;
using v8::Object;
using v8::String;
using v8::Value;
using v8::Exception;
using v8::Boolean;
using namespace node;


/**
  Does the 128 or 256 OpenSSL init

  @param key, they key that will be used for the crypto operation.

  @return EVP_CIPHER value returned from OpenSSL function.
*/
const EVP_CIPHER* EVP_aes_star_ccm(Local<Value> key) {
  size_t key_len = Buffer::Length(key);
  return (key_len == 16) ? EVP_aes_128_ccm() : EVP_aes_256_ccm();
}


/**
  Perform CCM mode AES-128 and AES-256 encryption using the provided key,
  IV, plaintext and auth_data buffers. Return an object containing "ciphertext"
  and "auth_tag" buffers.

  @param key, they key to encrypt with 16 or 32 bits
  @param iv, the initialization vector to user for the encryption
  @param plaintext, data to encrypt
  @param aad, additionaly authenticated data
  @param auth_tag_length, length of auth tag

  @return object containing "ciphertext" and "auth_tag" buffers.
*/
void CcmEncrypt(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<v8::Context> context = isolate->GetCurrentContext();

  if (args.Length() < 4 ||
      !Buffer::HasInstance(args[0]) ||
      !Buffer::HasInstance(args[1]) ||
      !Buffer::HasInstance(args[2]) ||
      !Buffer::HasInstance(args[3]) ||
      !args[4]->IsNumber()) {
    isolate->ThrowException(
      Exception::TypeError(
        String::NewFromUtf8(isolate, "encrypt requires a key Buffer, a " \
                      "IV Buffer, a plaintext Buffer, an auth_data " \
                      "Buffer parameter, and the length of the auth tag")));
    return;
  }

  // Make a buffer for the ciphertext that is the same size as the
  // plaintext, but padded to 16 byte increments
  size_t plaintext_len = Buffer::Length(args[2]);
  size_t ciphertext_len = (((plaintext_len - 1) / 16) + 1) * 16;
  unsigned char *ciphertext = new unsigned char[ciphertext_len];

  // Make a authentication tag buffer
  int auth_tag_len = args[4]->Int32Value(context).FromMaybe(0);
  unsigned char *auth_tag = new unsigned char[auth_tag_len];

  // Init OpenSSL interace with 128-bit or 256-bit AES CCM cipher and give it the
  // key and IV
  int outl = 0;
  EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
  EVP_EncryptInit_ex(ctx, EVP_aes_star_ccm(args[0]), NULL, NULL, NULL);

  size_t iv_len = Buffer::Length(args[1]);

  // set iv and auth tag length
  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_CCM_SET_IVLEN, iv_len, NULL);
  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_CCM_SET_TAG, auth_tag_len, NULL);

  EVP_EncryptInit_ex(ctx, NULL, NULL,
                    (unsigned char *)Buffer::Data(args[0]),
                    (unsigned char *)Buffer::Data(args[1]));

  int aad_len = Buffer::Length(args[3]);
  EVP_EncryptUpdate(ctx, NULL, &outl, NULL, plaintext_len);

  // Pass additional authenticated data
  // There is some extra complication here because Buffer::Data seems to
  // return NULL for empty buffers, and NULL makes update not work as we
  // expect it to.  So we force a valid non-NULL pointer for empty buffers.
  EVP_EncryptUpdate(ctx, NULL, &outl, aad_len ?
                    (unsigned char *)Buffer::Data(args[3]) : auth_tag,
                    aad_len);
  // Encrypt plaintext
  EVP_EncryptUpdate(ctx, ciphertext, &outl,
                    (unsigned char *)Buffer::Data(args[2]),
                    plaintext_len);
  // Finalize
  EVP_EncryptFinal_ex(ctx, ciphertext + outl, &outl);
  // Get the authentication tag
  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_CCM_GET_TAG, auth_tag_len, auth_tag);
  // Free the OpenSSL interface structure
  EVP_CIPHER_CTX_free(ctx);

  // Create the return buffers and object
  // We strip padding from the ciphertext
  MaybeLocal<Object> ciphertext_buf = Buffer::New(isolate, (char*)ciphertext, plaintext_len);
  MaybeLocal<Object> auth_tag_buf = Buffer::New(isolate, (char*)auth_tag, auth_tag_len);
  Local<Object> return_obj = Object::New(isolate);
  return_obj->Set(String::NewFromUtf8(isolate, "ciphertext"), ciphertext_buf.FromMaybe(Local<Object>()));
  return_obj->Set(String::NewFromUtf8(isolate, "auth_tag"), auth_tag_buf.FromMaybe(Local<Object>()));

  // Return it
  args.GetReturnValue().Set(return_obj);
}

/**
  Perform CCM mode AES-128 and AES-256 decryption using the provided key, IV,
  ciphertext, auth_data and auth_tag buffers. Returns an object containing
  a "plaintext" buffer and an "auth_ok" boolean.

  @param key, they key to encrypt with 16 or 32 bits
  @param iv, the initialization vector to user for the encryption.
  @param ciphertext, the encrypted data.
  @param aad, additionaly authenticated data.
  @param auth_tag, the auth tag.

  @return object containing "plaintext" and an "auth_ok" boolean.
*/
void CcmDecrypt(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  if (args.Length() < 5 ||
      !Buffer::HasInstance(args[0]) ||
      !Buffer::HasInstance(args[1]) ||
      !Buffer::HasInstance(args[2]) ||
      !Buffer::HasInstance(args[3]) ||
      !Buffer::HasInstance(args[4])
     ) {
    isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "decrypt requires a key Buffer, a " \
                      "IV Buffer, a ciphertext Buffer, an auth_data " \
                      "Buffer and an auth_tag Buffer parameter")));
  }

  // Make a buffer for the plaintext that is the same size as the
  // ciphertext, but padded to 16 byte increments
  size_t ciphertext_len = Buffer::Length(args[2]);
  size_t plaintext_len = (((ciphertext_len - 1) / 16) + 1) * 16;
  int aad_len = Buffer::Length(args[3]);
  unsigned char *plaintext = new unsigned char[plaintext_len];

  // Init OpenSSL interace with 128-bit or 256-bit AES CCM cipher and give it
  // the key and IV.
  int outl = 0;
  EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
  EVP_DecryptInit_ex(ctx, EVP_aes_star_ccm(args[0]), NULL, NULL, NULL);

  size_t iv_len = Buffer::Length(args[1]);
  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_CCM_SET_IVLEN, iv_len, 0);

  // Set the input reference authentication tag
  size_t auth_tag_len = Buffer::Length(args[4]);
  EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_CCM_SET_TAG, auth_tag_len,
                    Buffer::Data(args[4]));

  // Example showed we needed to do init again
  EVP_DecryptInit_ex(ctx, NULL, NULL,
                    (unsigned char *)Buffer::Data(args[0]),
                    (unsigned char *)Buffer::Data(args[1]));

  EVP_DecryptUpdate(ctx, NULL, &outl, NULL, ciphertext_len);

  // Pass additional authenticated data
  // There is some extra complication here because Buffer::Data seems to
  // return NULL for empty buffers, and NULL makes update not work as we
  // expect it to.  So we force a valid non-NULL pointer for empty buffers.
  EVP_DecryptUpdate(ctx, NULL, &outl, Buffer::Length(args[3]) ?
                    (unsigned char *)Buffer::Data(args[3]) : plaintext,
                    aad_len);

  // Decrypt ciphertext
  bool auth_ok = EVP_DecryptUpdate(ctx, plaintext, &outl,
                    (unsigned char *)Buffer::Data(args[2]),
                    ciphertext_len);
  // Finalize
  // Free the OpenSSL interface structure
  EVP_CIPHER_CTX_free(ctx);

  // Create the return buffer and object
  // We strip padding from the plaintext
  MaybeLocal<Object> plaintext_buf = Buffer::New(isolate, (char*)plaintext, ciphertext_len);
  Local<Object> return_obj = Object::New(isolate);
  return_obj->Set(String::NewFromUtf8(isolate, "plaintext"), plaintext_buf.FromMaybe(Local<Object>()));
  return_obj->Set(String::NewFromUtf8(isolate, "auth_ok"), Boolean::New(isolate, auth_ok));

  // Return it
  args.GetReturnValue().Set(return_obj);
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "encrypt", CcmEncrypt);
  NODE_SET_METHOD(exports, "decrypt", CcmDecrypt);
}

NODE_MODULE(node_aes_ccm, init)

} // namespace node_aes_ccm
