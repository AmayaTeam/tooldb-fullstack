import graphene
from django.contrib.auth.models import User

from api.graphql.inputs.profile import UpdateProfileInput
from api.models import Profile, UnitSystem
from api.graphql.payloads import ProfilePayload
from api.graphql.decorators import permission_required

class UpdateProfile(graphene.Mutation):
    class Arguments:
        input = UpdateProfileInput(required=True)

    Output = ProfilePayload

    @classmethod
    @permission_required("api.change_profile")
    def mutate(cls, root, info, input):
        try:
            user = User.objects.get(pk=input.user_id)
            profile = Profile.objects.get(user=user)
        except User.DoesNotExist:
            raise Exception("User not found")
        except Profile.DoesNotExist:
            raise Exception("Profile not found")

        if input.unitsystem_id:
            try:
                unitsystem = UnitSystem.objects.get(pk=input.unitsystem_id)
                profile.unitsystem = unitsystem
            except UnitSystem.DoesNotExist:
                raise Exception("UnitSystem not found")

        if input.language:
            profile.language = input.language

        profile.save()

        return ProfilePayload(profile=profile)