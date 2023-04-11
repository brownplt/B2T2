class RequireException < StandardError
  def initialize(message = "A custom error occurred.")
    super
  end
end
