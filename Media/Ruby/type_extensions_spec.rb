# frozen_string_literal: true

require './schema'
require './table'
require './type_extensions'

# rubocop:disable Metrics/BlockLength
# rubocop:disable RSpec/DescribeClass
RSpec.describe 'type extensions' do
  # explicitly testing type assertions establishing what assumptions we can make when enforcing sorts
  describe '.is_a?' do
    context 'when builtins' do
      context 'when given a String' do
        it 'returns true' do
          expect('hello world'.is_a?(String)).to be true
        end
      end

      context 'when given an Integer' do
        it 'returns true' do
          expect(10.is_a?(Integer)).to be true
        end
      end

      context 'when given a Float' do
        it 'returns true' do
          expect(10.0.is_a?(Float)).to be true
        end
      end

      it 'returns true' do
        expect(false.is_a?(Boolean)).to be true
      end
    end

    context 'when given a Symbol' do
      it 'returns true' do
        expect(:hello_world.is_a?(Symbol)).to be true
      end
    end

    context 'when given a NilClass' do
      it 'returns true' do
        expect(nil.is_a?(NilClass)).to be true
      end
    end

    context 'when given a Hash' do
      it 'returns true' do
        expect({ some_key: 'some_value' }.is_a?(Hash)).to be true
      end
    end

    context 'when given an Array' do
      it 'returns true' do
        expect([].is_a?(Array)).to be true
      end
    end
  end

  context 'when monkey patched' do
    context 'when given a Boolean' do
      it 'returns true' do
        expect(true.is_a?(Boolean)).to be true
      end
    end
  end

  context 'when user defined' do
    context 'when given a Table' do
      it 'returns true' do
        expect(Table.empty_table.is_a?(Table)).to be true
      end
    end
  end
end
# rubocop:enable Metrics/BlockLength
# rubocop:enable RSpec/DescribeClass
