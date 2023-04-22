# frozen_string_literal: true

# Violation of a require (not like an import require, but a constraint require)
class RequireException < StandardError
  def initialize(message = 'A custom error occurred.')
    super
  end
end
