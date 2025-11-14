from nutri.models.interfaces import User as Input


class Validator:
    def __init__(self, input: Input) -> None:
        self.input = input

    def validate(self) -> tuple:
        for func in [self.validate_mandatory_fields, self.validate_field_types]:
            valid, message = func()
            if not valid:
                return False, message

        return True, ""

    def validate_field_types(self) -> tuple:
        if self.input.phone:
            if len(self.input.phone) != 10:
                return False, f"Phone Number must be 10 digits"
            elif not self.input.phone.isdigit():
                return False, f"Phone Number must contain only digits"

        if self.input.email:
            if "@" not in self.input.email or "." not in self.input.email:
                return False, f"Email format is invalid"

        if self.input.password:
            if len(self.input.password) < 6:
                return False, f"Password must be at least 6 characters long"
            elif " " in self.input.password:
                return False, f"Password must not contain spaces"

        return True, ""

    def validate_mandatory_fields(self) -> tuple:
        req_fields = ['email', 'phone']

        if not any(getattr(self.input, field, None) for field in req_fields):
            return False, f"At least one of {', '.join(req_fields)} is required"

        if self.input.name is None or self.input.name.strip() == "":
            return False, "Name is required"

        return True, ""
