# frozen_string_literal: true

# Violation of an ensure
class EnsureException < StandardError
  def initialize(message = 'A custom error occurred.')
    super
  end
end
