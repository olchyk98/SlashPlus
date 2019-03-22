class Upload(graphene.Scalar):
    def serialize(self):
        pass

class UploadSignature(graphene.Mutation):
    class Input:
        file = Upload()
        token = graphene.String(required=True)

    image = graphene.String()

    @staticmethod
    def mutate(_, cls, token):
        user = get_current_user(_, cls, token)
        if user:
            for filename in cls.context.FILES:
                file = cls.context.FILES[filename]

                try:
                    im = Image.open(file.file)
                except Exception:
                    # Not an Image!
                    return UploadSignature(ok=False)

                # save user image
                user.image = file
                user.save()

                # if more files in request, just skip them
                return UploadSignature(image=user.image.url.replace("gotosite/", ""))
            # if no files - no changes
            return UploadSignature(image=user.image.url.replace("gotosite/", ""))
        else:
            # don't know what user works with us
            return UploadSignature(image="")
