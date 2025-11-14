from nutri.models.interfaces import LoginInput as Input


class Validator:
    def __init__(self, input: Input) -> None:
        self.input = input

    def validate(self) -> tuple:
        if not (self.input.phone or self.input.email):
            return False, "Either phone or email must be provided"

        if not self.input.password:
            return False, "Password must be provided"

        return True, ""
